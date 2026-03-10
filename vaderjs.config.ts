undefined
import defineConfig from "vaderjs-native/config";

export default defineConfig({
  port: 3000,
  app: {
    name: "clement_cargetter",
    id: "com.example.clement_cargetter",
    version: { code: 1, name: "1.0.0" },
  },
  platforms: {
    web: { title: "clement_cargetter", themeColor: "#111827" },
    windows: {
      publisher: "CN=VaderJS",
      icon: "./assets/windows/icon.png",
      executionAlias: "clement_cargetter",
      sdkVersion: "10.0.19041.0", 
      minSdkVersion: "10.0.17763.0"
    }
  },
  plugins: []
});