<template>
  <div class="min-h-screen grid grid-cols-[auto,1fr]">

    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
      </main>
    </SidebarProvider>

    <div class="w-full flex flex-col">
      <main class="flex-grow">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
</script>
