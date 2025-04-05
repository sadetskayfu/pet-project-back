import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class MediaService {
	constructor(private configService: ConfigService) {
		cloudinary.config({
			cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
			api_key: this.configService.get('CLOUDINARY_API_KEY'),
			api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
		});
	}

	async uploadMedia(
		buffer: Buffer,
		folder: string,
		publicId: string,
		resourceType: 'image' | 'video' = 'image',
	): Promise<string> {
		return new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						public_id: publicId,
						folder,
						resource_type: resourceType,
					},
					(error, result) => {
						if (error || !result) {
							reject(error || new Error('Upload failed'));
						} else {
							resolve(result.secure_url);
						}
					},
				)
				.end(buffer);
		});
	}

	getSizedImageUrl(baseUrl: string, width: number): string {
		const urlParts = baseUrl.split('/upload/');
		return `${urlParts[0]}/upload/w_${width}/${urlParts[1]}`;
	}

	getVideoResolutionUrl(
		baseUrl: string,
		width: number,
		height: number,
	): string {
		const urlParts = baseUrl.split('/upload/');
		return `${urlParts[0]}/upload/w_${width},h_${height},c_scale/${urlParts[1]}`;
	}
}
