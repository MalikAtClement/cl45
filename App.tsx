import { createElement, render } from "vaderjs-native";
import { useRoute , createRouter} from "vaderjs-native/router"; 
import Home from "./app/index";
import Credit from "./app/credit-prequal"
export const router = createRouter({
  routes: [
    {
      path: "/",
      component: Home, 
    }, 
    {
        path: "/credit-prequal/:stocknumber",
        component: Credit
    }
  ],
  fallback: () => <div>404 Not Found</div>
});
function App() {
  const route = useRoute();

  if (route === "loading") {
    return <div>Loading...</div>;
  }

  if (!route) {
    const Fallback = router.getFallback();
    return Fallback ? <Fallback /> : null;
  }

  const Component = route.route.component;
  const Layout = route.route.layout;

  if (Layout) {
    return (
      <Layout>
        <Component params={route.params} query={route.query} />
      </Layout>
    );
  }

  return <Component params={route.params} query={route.query} />;
}

render(createElement(App), document.getElementById("app"))
