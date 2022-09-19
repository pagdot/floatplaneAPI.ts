import { expect, test } from "vitest";

import got from "got";
import { Creator } from "./creator.js";
import { imageFormat, gotExtends, creatorObjFormat, metadataFormat, eExpect } from "./lib/testHelpers.js";

import type { BlogPost } from "./creator.js";
export const blogPostFormat: BlogPost = {
	id: expect.any(String),
	guid: expect.any(String),
	title: expect.any(String),
	tags: eExpect.arrayContainingOrEmpty([expect.any(String)]),
	text: expect.any(String),
	type: expect.stringMatching("blogPost"),
	attachmentOrder: expect.arrayContaining([expect.any(String)]),
	metadata: metadataFormat,
	releaseDate: expect.any(String),
	likes: expect.any(Number),
	dislikes: expect.any(Number),
	score: expect.any(Number),
	comments: expect.any(Number),
	creator: creatorObjFormat,
	isAccessible: expect.any(Boolean),
	thumbnail: eExpect.objectContainingOrNull(imageFormat),
	videoAttachments: eExpect.arrayContainingOrEmpty([expect.any(String)]),
	audioAttachments: eExpect.arrayContainingOrEmpty([expect.any(String)]),
	pictureAttachments: eExpect.arrayContainingOrEmpty([expect.any(String)]),
	galleryAttachments: eExpect.arrayContainingOrEmpty([expect.any(String)]),
	wasReleasedSilently: expect.any(Boolean),
};

const creator = new Creator(got.extend(gotExtends()));

test("Creator.blogPosts(creatorGUID)", () => {
	return expect(creator.blogPosts("59f94c0bdd241b70349eb72b")).resolves.toStrictEqual(expect.arrayContaining<BlogPost>([blogPostFormat]));
});

test("Creator.blogPostsIterable(creatorGUID).next()", async () => {
	return expect((await creator.blogPostsIterable("59f94c0bdd241b70349eb72b").next()).value).toStrictEqual(blogPostFormat);
});

test("for await (const blogPost of Creator.blogPostsIterable(creatorGUID))", async () => {
	for await (const blogPost of creator.blogPostsIterable("59f94c0bdd241b70349eb72b")) {
		return expect(blogPost).toStrictEqual(blogPostFormat);
	}
});