import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import App from "./pages/App";
import {store} from "./store";

function render() {
  const root = createRoot(document.getElementById("root"));
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}

render();
