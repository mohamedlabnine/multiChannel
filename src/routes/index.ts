import {createRouter, createWebHistory} from "vue-router";
import Dashboard from "@/pages/Dashboard.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import CampaingsPage from "@/pages/CampaingsPage.vue";
import ContactPage from "@/pages/ContactPage.vue";
import SmsCampagnesPage from "@/pages/campagnes/sms/IndexPage.vue";
import WhatsapCampagnesPage from "@/pages/campagnes/whatsapp/IndexPage.vue";
import TemplatePage from "@/pages/campagnes/whatsapp/TemplatePage.vue";
import ListePage from "@/pages/ListePage.vue";
import AdsCampagnesPage from "@/pages/campagnes/ads/IndexPage.vue";


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
            {
                path: "listes",
                name: "listes",
                component: ListePage,
                props: true,
                //meta: { requiresAuth: true }
            },
            {
                path: "contacts",
                name: "contacts",
                component: ContactPage,
                props: true,
                //meta: { requiresAuth: true }
            },
            {
                path: "campaigns/email",
                name: "Campaigns_email",
                component: CampaingsPage,
                props: true,
                //meta: { requiresAuth: true }
            },
            {
                path: "campaigns/sms",
                name: "Campaigns_sms",
                component: SmsCampagnesPage,
                props: true,
                //meta: { requiresAuth: true }
            },
            {
                path: "campaigns/whatsapp",
                name: "Campaigns_whatsapp",
                component: WhatsapCampagnesPage,
                props: true,
                //meta: { requiresAuth: true }
            },
            {
                path: "campaigns/whatsapp/templates",
                name: "Campaigns_whatsapp_templates",
                component: TemplatePage,
                props: true,
                //meta: { requiresAuth: true }
            },
            {
                path: "campaigns/ads",
                name: "Campaigns_ads",
                component: AdsCampagnesPage,
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
