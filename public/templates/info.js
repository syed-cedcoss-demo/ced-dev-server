export const serverStatus = () => {
  return `
   <!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8" />
      <meta
         name="viewport"
         content="width=device-width, initial-scale=1.0"
         />
      <title>server status</title>
      <style>
         .info {
            font-size: 50px;
            font-size-adjust: 0.5;
            color: #9880ff;
            display: inline-block;
         }
         .info:after {
            position: absolute;
            margin-left: .1rem;
            content: ' ...';
            animation: loading steps(4) 2s infinite;
            clip: rect(auto, 0px, auto, auto);
         }
         @keyframes loading {
            to {
               clip: rect(auto, 60px, auto, auto);
            }
         }
      </style>
   </head>
   <body>
      <div style="display:flex; justify-content:center; align-items:center; height:100vh;">
         <h2 class="info">Server is running</h2>
      </div>
   </body>
</html>
    `;
};
