import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the client module before importing the query wrappers, so
// client.fetch is a spy instead of hitting real Sanity. vi.mock's factory is
// hoisted above these imports, so the mock fn itself has to come from
// vi.hoisted() rather than a plain top-level const.
const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }));
vi.mock("@/lib/sanity/client", () => ({
  client: { fetch: fetchMock },
}));

import { getPosts, getPostBySlug, getLatestPosts, type Post } from "@/lib/posts";
import { getServices } from "@/lib/services";
import { getProfile } from "@/lib/profile";

beforeEach(() => {
  fetchMock.mockReset();
});

// This is a regression guard, not incidental detail: AGENTS.md / web/AGENTS.md
// both call out that Sanity content must stream with a short revalidation
// window, not bake into the static shell via "use cache" — an editor's
// publish is expected to show up within ~30s. If a future refactor swaps
// this for "use cache", these are the tests that go red.
describe("revalidate: 30 on every Sanity fetch", () => {
  it("getPosts", async () => {
    fetchMock.mockResolvedValue([]);
    await getPosts();
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), {}, { next: { revalidate: 30 } });
  });

  it("getPostBySlug", async () => {
    fetchMock.mockResolvedValue(null);
    await getPostBySlug("mi-post");
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), { slug: "mi-post" }, { next: { revalidate: 30 } });
  });

  it("getServices", async () => {
    fetchMock.mockResolvedValue([]);
    await getServices();
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), {}, { next: { revalidate: 30 } });
  });

  it("getProfile", async () => {
    fetchMock.mockResolvedValue(null);
    await getProfile();
    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), {}, { next: { revalidate: 30 } });
  });
});

describe("query shape", () => {
  it("getPosts orders by publishedAt desc and projects slug.current", async () => {
    fetchMock.mockResolvedValue([]);
    await getPosts();
    const [query] = fetchMock.mock.calls[0];
    expect(query).toContain("order(publishedAt desc)");
    expect(query).toContain('"slug": slug.current');
  });

  it("getPostBySlug passes slug as a query parameter, not interpolated into the GROQ string", async () => {
    // GROQ-injection guard: a malicious slug must travel as a $param, never
    // get string-concatenated into the query itself.
    fetchMock.mockResolvedValue(null);
    const evilSlug = '"][_type=="profile"]//';
    await getPostBySlug(evilSlug);
    const [query, params] = fetchMock.mock.calls[0];
    expect(query).not.toContain(evilSlug);
    expect(params).toEqual({ slug: evilSlug });
  });

  it("getPostBySlug returns null when Sanity returns null", async () => {
    fetchMock.mockResolvedValue(null);
    expect(await getPostBySlug("no-existe")).toBeNull();
  });
});

describe("getLatestPosts", () => {
  const posts: Post[] = Array.from({ length: 5 }, (_, i) => ({
    slug: `post-${i}`,
    title: `Post ${i}`,
    excerpt: "...",
    date: `2026-01-0${i + 1}`,
    type: "articulo",
  }));

  it("slices 5 posts down to a limit of 3, preserving order", async () => {
    fetchMock.mockResolvedValue(posts);
    const result = await getLatestPosts(3);
    expect(result.map((p) => p.slug)).toEqual(["post-0", "post-1", "post-2"]);
  });

  it("returns all posts when the limit exceeds the count", async () => {
    fetchMock.mockResolvedValue(posts.slice(0, 2));
    const result = await getLatestPosts(5);
    expect(result).toHaveLength(2);
  });

  it("returns an empty array for a limit of 0", async () => {
    fetchMock.mockResolvedValue(posts);
    expect(await getLatestPosts(0)).toEqual([]);
  });

  it("returns an empty array when there are no posts", async () => {
    fetchMock.mockResolvedValue([]);
    expect(await getLatestPosts(3)).toEqual([]);
  });
});
