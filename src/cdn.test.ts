import { test } from "vitest";

import got from "got";
import { CDN, VodLiveDeliveryResponse, DownloadDeliveryResponse } from "./cdn.js";
import { clientFormat, edgeFormat, gotExtends, expect } from "./lib/testHelpers.js";

import type { components } from "./lib/apiSchema.js";

const qualityLevelFormat: components["schemas"]["CdnDeliveryV2QualityLevelModel"] = {
	name: expect.any(String),
	width: expect.any(Number),
	height: expect.any(Number),
	label: expect.any(String),
	order: expect.any(Number),
	mimeType: expect.typeOrNull(String),
	codecs: expect.typeOrNull(String),
};
const Strategy = ["cdn", "client"] as const;
const liveDeliveryResponseFormat: VodLiveDeliveryResponse = {
	cdn: expect.any(String),
	strategy: expect.enum(Strategy),
	resource: {
		uri: expect.any(String),
		data: {
			token: expect.any(String),
		},
	},
};

const downloadDeliveryResponseFormat: DownloadDeliveryResponse = {
	edges: expect.arrayContainingOrEmpty([edgeFormat]),
	client: clientFormat,
	strategy: expect.enum(Strategy),
	resource: {
		uri: expect.any(String),
		data: {
			qualityLevels: expect.arrayContaining<components["schemas"]["CdnDeliveryV2QualityLevelModel"]>([qualityLevelFormat]),
			token: expect.any(String),
		},
	},
};

const cdn = new CDN(got.extend(gotExtends()));

test('CDN.delivery("live", creator)', () => {
	return expect(cdn.delivery("live", "59f94c0bdd241b70349eb72b")).resolves.toStrictEqual(liveDeliveryResponseFormat);
});

test('CDN.delivery("download", guid)', async () => {
	return expect(cdn.delivery("download", "InwhyES1dt")).resolves.toStrictEqual(downloadDeliveryResponseFormat);
});
