// src/domain/entities/product-image.entity.ts
export class ProductImageEntity {
    image_id: number;
    product_id: number;
    image_url: string;
    alt_text?: string;
    sort_order: number;
  
    constructor(props: {
      image_id?: number;
      product_id: number;
      image_url: string;
      alt_text?: string;
      sort_order?: number;
    }) {
      this.image_id = props.image_id ?? 0;
      this.product_id = props.product_id;
      this.image_url = props.image_url;
      this.alt_text = props.alt_text;
      this.sort_order = props.sort_order ?? 0;
    }
  }
  