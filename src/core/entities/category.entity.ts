export class CategoryEntity {
    category_id?: number;
    name: string;
    description?: string;
    created_at?: Date;
  
    constructor(props: {
      category_id?: number;
      name: string;
      description?: string;
      created_at?: Date;
    }) {
      this.category_id = props.category_id;
      this.name = props.name;
      this.description = props.description;
      this.created_at = props.created_at;
    }
  }