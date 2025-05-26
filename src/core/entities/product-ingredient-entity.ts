export class ProductIngredientEntity {
    product_id: number;
    ingredient_id: number;
  
    constructor(props: { product_id: number; ingredient_id: number }) {
      this.product_id = props.product_id;
      this.ingredient_id = props.ingredient_id;
    }
  }