import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve as _resolve, join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { config } from "dotenv";

import webpack from "webpack";

config();
export default {
  entry: "./src/index.tsx",
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    new webpack.DefinePlugin({
      // 'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL),
      // 'process.env.HOST_PORT':    JSON.stringify(process.env.HOST_PORT),
      // 'process.env.STORAGE_PREFIX': JSON.stringify(process.env.STORAGE_PREFIX),
      "process.env": JSON.stringify(process.env),
    }),

    // new CopyPlugin({
    //   patterns: [{ from: "public/icons", to: "icons" }],
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: { "@": _resolve(__dirname, ".") },
  },
  output: {
    filename: "bundle.js",
    path: _resolve(__dirname, "dist"),
    clean: true,
  },
};
