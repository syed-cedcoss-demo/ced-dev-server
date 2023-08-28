import axios from 'axios';
export const createDemoProducts = (id) => {
  const data = JSON.stringify({
    name: `Samsung pad 9a-${id}`,
    type: 'physical',
    sku: `Samsung pad 9a-${id}`,
    description:
      '<p><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel metus ac est egestas porta sed quis erat. Integer id nulla massa. Proin vitae enim nisi. Praesent non dignissim nulla. Nulla mattis id massa ac pharetra. Mauris et nisi in dolor aliquam sodales. Aliquam dui nisl, dictum quis leo sit amet, rutrum volutpat metus. Curabitur libero nunc, interdum ac libero non, tristique porttitor metus. Ut non dignissim lorem, in vestibulum leo. Vivamus sodales quis turpis eget.</span></p>',
    weight: 1,
    width: 10,
    depth: 0,
    height: 0,
    price: 50,
    cost_price: 25,
    retail_price: 30,
    sale_price: 50,
    map_price: 0,
    tax_class_id: 0,
    product_tax_code: 'string',
    brand_id: 0,
    inventory_level: 100,
    inventory_warning_level: 0,
    inventory_tracking: 'product',
    fixed_cost_shipping_price: 0,
    is_free_shipping: true,
    is_visible: true,
    is_featured: false,
    related_products: [0],
    warranty: 'string',
    bin_picking_number: 'string',
    layout_file: 'string',
    upc: 'string',
    search_keywords: 'string',
    availability_description: 'string',
    availability: 'available',
    sort_order: -2147483648,
    condition: 'New',
    is_condition_shown: true,
    order_quantity_minimum: 0,
    order_quantity_maximum: 0,
    page_title: 'string',
    meta_keywords: ['string'],
    meta_description: 'string',
    view_count: 0,
    preorder_release_date: '2019-08-24T14:15:22Z',
    preorder_message: 'string',
    is_preorder_only: true,
    is_price_hidden: true,
    price_hidden_label: 'string',
    open_graph_type: 'product',
    open_graph_title: 'string',
    open_graph_description: 'string',
    open_graph_use_meta_description: true,
    open_graph_use_product_name: true,
    open_graph_use_image: true,
    'brand_name or brand_id': 'Common Good',
    gtin: 'string',
    mpn: 'string',
    reviews_rating_sum: 3,
    reviews_count: 4,
    total_sold: 80,
    bulk_pricing_rules: [
      {
        quantity_min: 10,
        quantity_max: 50,
        type: 'price',
        amount: 10
      }
    ],
    images: [
      {
        image_file:
          'https://image-us.samsung.com/us/galaxy-tab-s8/configurator/01-TabS8-Family-KV-Configurator-DT-633x475.jpg',
        is_thumbnail: true,
        sort_order: -2147483648,
        description: 'string',
        image_url:
          'https://image-us.samsung.com/us/galaxy-tab-s8/configurator/01-TabS8-Family-KV-Configurator-DT-633x475.jpg',
        id: 0,
        product_id: 2,
        url_zoom: 'string',
        url_standard: 'string',
        url_thumbnail: 'string',
        url_tiny: 'string',
        date_modified: '2019-08-24T14:15:22Z'
      }
    ],
    videos: [
      {
        title: 'Writing Great Documentation',
        description: 'A video about documenation',
        sort_order: 1,
        type: 'youtube',
        video_id: 'z3fRu9pkuXE',
        id: 0,
        product_id: 0,
        length: 'string'
      }
    ]
  });

  const config = {
    method: 'post',
    url: 'https://api.bigcommerce.com/stores/8heb774vzt/v3/catalog/products',
    headers: {
      'X-Auth-Token': 's8h30hbdnli25i76v2631136jlkduav',
      'Content-Type': 'application/json'
    },
    data
  };

  axios(config)
    .then(function (response) {
      console.log('product created', id);
      createDemoProducts(id + 1);
    })
    .catch(function (error) {
      console.log(error?.message, id);
      createDemoProducts(id);
    });
};
