import type { Schema, Struct } from '@strapi/strapi';

export interface MediaVideoSource extends Struct.ComponentSchema {
  collectionName: 'components_media_video_sources';
  info: {
    displayName: 'videoSource';
  };
  attributes: {
    directFile: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    externalUrl: Schema.Attribute.String;
    nasPath: Schema.Attribute.String;
    sourceType: Schema.Attribute.Enumeration<['NAS', 'External', 'Direct']>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'media.video-source': MediaVideoSource;
    }
  }
}
