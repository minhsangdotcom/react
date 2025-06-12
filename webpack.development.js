import { merge } from "webpack-merge";
import common from './webpack.common.js';
import { resolve as _resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    client: {
      logging: "info",
      overlay: true,
    },
    compress: true,
    open: false,
    historyApiFallback: true,
    static: _resolve(__dirname, "public"),
    hot: true,
    port: process.env.HOST_PORT || 3000,
  },
  stats: {
    errorDetails: true,
  },
});
