# CEC-DEV-SERVER BY SYED

The BigCommerce Integration and Real-Time Notification project is a comprehensive solution designed to seamlessly connect and synchronize data between BigCommerce, an e-commerce platform, and a local system. The project encompasses functionalities such as product import, order synchronization, and real-time notifications using the Socket.IO technology stack. The combination of Node.js, Express.js, MongoDB, and Socket.IO provides a robust and efficient framework for managing e-commerce operations and ensuring real-time updates to enhance user experience.

### Features

###### BigCommerce Integration:

The project provides a mechanism to import products from BigCommerce's catalog into the local system's database. This integration ensures that product details, including names, descriptions, prices, images, and other attributes, are seamlessly transferred and maintained up-to-date.

###### Order Synchronization:

Orders placed on the BigCommerce platform are synchronized with the local system's order management system. This synchronization includes order details, customer information, shipping addresses, and associated products. This feature enables efficient order processing and tracking.

###### Product Sync:

The project ensures that product information remains synchronized between BigCommerce and the local system. This includes updates to product details such as price changes, availability, and product descriptions. The system regularly checks for changes on both ends and updates the data accordingly.

###### Real-Time Notifications using Socket.IO:

Real-time updates are a critical aspect of e-commerce operations. The integration of Socket.IO allows the project to deliver instant notifications to users about various events, such as new orders, order status changes, and product updates. This feature enhances customer engagement and ensures timely actions.

### Dependencies

- axios
- bcryptjs
- cors
- mongoose
- socket.io
- jsonwebtoken
- nodemailer
- express
- dotenv

### Getting Started

- clone the project
- go to project root folder & do npm i or yarn add

### Executing program

- create .env file in the project root folder
- copy below env format & replace exact value.
- start in development mode.

```bash
  npm run dev
```

- start in production mode

```bash
  npm start
```

### ENV Variable

```
NODE_ENV = development;
PORT = '';
MONGO_URI = '';
APP_JWT_SECRET = '';
EMAIL_ID = '';
EMAIL_PASS = ''; //note: email must be outlook.com mail.
SERVER_URL = '';
APP_URL = '';

```

## Help

- feel free to connect @syedhasnainmehadi@cedcommerce.com

## Authors

- [@Syed Hasnain Mehadi](https://github.com/hasnain-cedcoss)

## 🔗 Links

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://in.linkedin.com/in/syed-hasnain-mehadi-b94971188/)

## License

free to use for educational purpose only.

## staging URL

[@Staging Server URL](https://ced-dev-server.onrender.com/)
