import {createRouter, createWebHistory} from "vue-router";
import Dashboard from "@/pages/Dashboard.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

const routes = [
    {
        path: "/",
        component: DashboardLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: "",
                component: Dashboard,
                name: "dashboard",
                meta: { requiresAuth: true }
            },
            {
                path: "dashboard",
                name: "Dashboard",
                component: Dashboard,
                props: true,
                //meta: { requiresAuth: true }
            },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
