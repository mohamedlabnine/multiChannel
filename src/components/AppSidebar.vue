<script setup lang="ts">
import { ref } from 'vue';
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Contact,
  FolderIcon,
  GalleryVerticalEnd,
  Home,
  LayoutTemplate,
  MessageSquare,
  PlusCircle,
  Search,
  Settings,
  Star,
  Users
} from "lucide-vue-next";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Main navigation items
const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Contacts",
    url: "/contacts",
    icon: Contact,
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: FolderIcon,
    badge: "3",
    subItems: [
      {
        title: "All Campaigns",
        url: "/campaigns",
      },
      {
        title: "Drafts",
        url: "/campaigns/drafts",
        badge: "2",
      },
      {
        title: "Scheduled",
        url: "/campaigns/scheduled",
        badge: "1",
      },
      {
        title: "Sent",
        url: "/campaigns/sent",
      },
      {
        title: "Templates",
        url: "/campaigns/templates",
      },
    ],
  },
  {
    title: "Subscribers",
    url: "/subscribers",
    icon: Users,
    subItems: [
      {
        title: "All Subscribers",
        url: "/subscribers",
      },
      {
        title: "Segments",
        url: "/subscribers/segments",
      },
      {
        title: "Forms",
        url: "/subscribers/forms",
      },
    ],
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    subItems: [
      {
        title: "Overview",
        url: "/analytics",
      },
      {
        title: "Campaign Performance",
        url: "/analytics/campaigns",
      },
      {
        title: "Subscriber Growth",
        url: "/analytics/growth",
      },
      {
        title: "Link Tracking",
        url: "/analytics/links",
      },
    ],
  },
  {
    title: "Automations",
    url: "/automations",
    icon: Calendar,
  },
];

// Tools navigation items
const toolsNavItems = [
  {
    title: "Templates",
    url: "/templates",
    icon: LayoutTemplate,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: MessageSquare,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
];

// Expanded state for collapsible sections
const expandedSections = ref({
  campaigns: true,
  subscribers: false,
  analytics: false,
});

// Toggle section expansion
const toggleSection = (section: string) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

// User information
const user = {
  name: "Sarah Johnson",
  email: "sarah@example.com",
  plan: "Pro",
};
</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GalleryVerticalEnd class="size-4" />
            </div>
            <div class="flex flex-col gap-0.5 leading-none">
              <span class="font-semibold">EmailPro</span>
              <span class="text-xs text-muted-foreground">Marketing Platform</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <!-- Main Navigation -->
      <SidebarGroup>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <template v-for="item in mainNavItems" :key="item.title">
              <SidebarMenuItem>
                <!-- If item has subitems, make it toggleable -->
                <template v-if="item.subItems && item.subItems.length">
                  <SidebarMenuButton
                      :isActive="item.isActive"
                      @click="toggleSection(item.title.toLowerCase())"
                  >
                    <component :is="item.icon" class="h-4 w-4" />
                    <span>{{ item.title }}</span>
                    <ChevronDown
                        class="ml-auto h-4 w-4 transition-transform"
                        :class="{ 'rotate-180': expandedSections[item.title.toLowerCase()] }"
                    />
                    <SidebarMenuBadge v-if="item.badge">{{ item.badge }}</SidebarMenuBadge>
                  </SidebarMenuButton>

                  <!-- Submenu items -->
                  <SidebarMenuSub v-show="expandedSections[item.title.toLowerCase()]">
                    <SidebarMenuSubItem v-for="subItem in item.subItems" :key="subItem.title">
                      <SidebarMenuSubButton asChild>
                        <a :href="subItem.url">
                          {{ subItem.title }}
                          <span v-if="subItem.badge" class="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md bg-primary/10 px-1 text-xs font-medium">
                            {{ subItem.badge }}
                          </span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </template>

                <!-- Regular menu item without subitems -->
                <SidebarMenuButton v-else :isActive="item.isActive" asChild>
                  <a :href="item.url">
                    <component :is="item.icon" class="h-4 w-4" />
                    <span>{{ item.title }}</span>
                    <SidebarMenuBadge v-if="item.badge">{{ item.badge }}</SidebarMenuBadge>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </template>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Tools Section -->
      <SidebarGroup>
        <SidebarGroupLabel>Tools</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in toolsNavItems" :key="item.title">
              <SidebarMenuButton asChild>
                <a :href="item.url">
                  <component :is="item.icon" class="h-4 w-4" />
                  <span>{{ item.title }}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Quick Actions -->
      <SidebarGroup>
        <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton class="bg-primary/10 hover:bg-primary/20 text-primary">
                <PlusCircle class="h-4 w-4" />
                <span>New Campaign</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href="/settings">
              <Settings class="h-4 w-4" />
              <span>Settings</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
              <span class="text-xs font-medium">SJ</span>
            </div>
            <div class="flex flex-col gap-0.5 leading-none">
              <span class="font-medium">{{ user.name }}</span>
              <span class="text-xs text-muted-foreground">{{ user.plan }} Plan</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>

<style scoped>
/* Add any additional custom styling here */
</style>
