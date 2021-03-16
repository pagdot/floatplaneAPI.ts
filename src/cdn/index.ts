import Core from "../Core";

import type Request from "got/dist/source/core";

import type { Options } from "got/dist/source/core";
import { Client, Edge } from "../lib/types";
export type GotOptions = Options & { isStream: true };

export type DeliveryTypes = "live" | "vod" | "download";
export type DeliveryResponse = LiveDeliveryResponse | VodDeliveryResponse | VideoDeliveryResponse;

export type QualityLevel = {
	name: string;
	width: number;
	height: number;
	label: string;
	order: number;
};

export type LiveDeliveryResponse = {
	cdn: string;
	strategy: string;
	resource: {
		// "/api/video/v1/~~.m3u8?token={token}&allow_source=false"
		uri: string;
		data: {
			token: string;
		};
	};
};
export type QualityLevelParam = { token: string };
export type VodDeliveryResponse = {
	cdn: string;
	strategy: string;
	resource: {
		// "/Videos/~~/{data.qualityLevel.name}.mp4/chunk.m3u8?token={data.qualityLevelParam.token}"
		uri: string;
		data: {
			qualityLevels: Array<QualityLevel>;
			qualityLevelParams: { 
				[key: string]: QualityLevelParam 
			};
		};
	};
};
export type VideoDeliveryResponse = {
	client?: Client;
	edges: Array<Edge>;
	strategy: string;
	resource: {
		// "/Videos/{videoGUID}/{data.qualityLevel.name}.mp4?wmsAuthSign={data.token}"
		uri: string;
		data: {
			qualityLevels: Array<QualityLevel>;
			token: string;
		};
	};
};

export default class CDN extends Core {
	endpoints = {
		url: "https://www.floatplane.com/api/v2/cdn/delivery",
	};

	/**
	 * Gets the resource information from cdn
	 * @param type Type of resource to fetch info for.
	 * @param id ID of resource.
	 */
	async delivery(type: "live", creator: string): Promise<LiveDeliveryResponse>;
	async delivery(type: "vod", guid: string): Promise<VodDeliveryResponse>;
	async delivery(type: "download", guid: string): Promise<VideoDeliveryResponse>;
	async delivery(type: DeliveryTypes, id: string): Promise<DeliveryResponse> {
		return JSON.parse(await this.got(this.endpoints.url + `?type=${type}` + (type === "live" ? `&creator=${id}` : `&guid=${id}`), { resolveBodyOnly: true }));
	}
}