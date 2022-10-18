import { LoginForm } from "../container";
import { Homepage } from "../container";
import PageNotFound from "../component/PageNotFound";

const routesData = [
    {
        path: "/",
        name: "login",
        component: <LoginForm />,
        isAuthRequired: false
    },

    {
        path: "stock",
        name: "stock",
        component: <Homepage />,
        isAuthRequired: true
    },
    
    {
        path: "page-not-found",
        name: "page-not-found",
        component: <PageNotFound />,
        isAuthRequired: true
    },
];

export default routesData;