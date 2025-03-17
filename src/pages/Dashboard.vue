<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Header -->
    <!-- <header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="flex h-14 items-center px-4 md:px-6">
        <div class="flex items-center gap-2 font-semibold">
          <FolderIcon class="h-6 w-6" />
          <span>EmailPro Dashboard</span>
        </div>
        <div class="ml-auto flex items-center gap-2">
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
            <BellIcon class="h-4 w-4 mr-2" />
            <span class="sr-only sm:not-sr-only sm:ml-1">Notifications</span>
          </button>
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">
            <img
                src="https://github.com/shadcn.png"
                alt="Avatar"
                class="rounded-full h-7 w-7"
            />
          </button>
        </div>
      </div>
    </header>
    -->

    <!-- Main Content with Sidebar -->
      <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">

        <div class="flex items-center">
          <h1 class="font-semibold text-lg md:text-2xl">Dashboard Overview</h1>
         <!-- <button class="ml-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
            <PlusIcon class="mr-2 h-4 w-4" />
            New Campaign
          </button>-->
        </div>

        <!-- KPI Cards -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 class="tracking-tight text-sm font-medium">Total Subscribers</h3>
              <UsersIcon class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="p-6 pt-0">
              <div class="text-2xl font-bold">12,234</div>
              <p class="text-xs text-muted-foreground">
                <span class="text-emerald-500">+573</span> from last month
              </p>
            </div>
          </div>
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 class="tracking-tight text-sm font-medium">Open Rate</h3>
              <EyeIcon class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="p-6 pt-0">
              <div class="text-2xl font-bold">24.8%</div>
              <p class="text-xs text-muted-foreground">
                <span class="text-emerald-500">+2.3%</span> from last campaign
              </p>
            </div>
          </div>
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 class="tracking-tight text-sm font-medium">Click Rate</h3>
              <MousePointerClickIcon class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="p-6 pt-0">
              <div class="text-2xl font-bold">6.2%</div>
              <p class="text-xs text-muted-foreground">
                <span class="text-rose-500">-0.4%</span> from last campaign
              </p>
            </div>
          </div>
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 class="tracking-tight text-sm font-medium">Conversion Rate</h3>
              <ArrowRightIcon class="h-4 w-4 text-muted-foreground" />
            </div>
            <div class="p-6 pt-0">
              <div class="text-2xl font-bold">3.1%</div>
              <p class="text-xs text-muted-foreground">
                <span class="text-emerald-500">+0.2%</span> from last campaign
              </p>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm col-span-4">
            <div class="flex flex-col space-y-1.5 p-6">
              <h3 class="text-lg font-semibold leading-none tracking-tight">Campaign Performance</h3>
              <p class="text-sm text-muted-foreground">Open and click rates over the last 30 days</p>
            </div>
            <div class="p-6 pt-0 h-[300px]">
              <!-- Line Chart Placeholder -->
              <div class="h-full w-full bg-muted/20 rounded-md flex items-center justify-center">
                <div class="h-[240px] w-full relative">
                  <!-- This would be replaced with an actual chart component -->
                  <div class="absolute bottom-0 left-0 w-full h-[180px] bg-gradient-to-t from-primary/10 to-transparent"></div>
                  <div class="absolute bottom-0 left-0 w-full h-[1px] bg-primary/20"></div>
                  <div class="absolute bottom-[60px] left-0 w-full h-[1px] bg-muted"></div>
                  <div class="absolute bottom-[120px] left-0 w-full h-[1px] bg-muted"></div>
                  <div class="absolute bottom-[180px] left-0 w-full h-[1px] bg-muted"></div>

                  <!-- Line for Open Rate -->
                  <svg class="absolute inset-0 h-full w-full">
                    <path
                        d="M0,180 L100,150 L200,120 L300,140 L400,100 L500,80 L600,60"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        stroke-width="2"
                    />
                  </svg>

                  <!-- Line for Click Rate -->
                  <svg class="absolute inset-0 h-full w-full">
                    <path
                        d="M0,200 L100,190 L200,180 L300,185 L400,170 L500,160 L600,150"
                        fill="none"
                        stroke="hsl(var(--primary)/0.5)"
                        stroke-width="2"
                        stroke-dasharray="4 4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm col-span-3">
            <div class="flex flex-col space-y-1.5 p-6">
              <h3 class="text-lg font-semibold leading-none tracking-tight">Audience Engagement</h3>
              <p class="text-sm text-muted-foreground">Engagement by subscriber segment</p>
            </div>
            <div class="p-6 pt-0 h-[300px]">
              <!-- Pie Chart Placeholder -->
              <div class="h-full w-full bg-muted/20 rounded-md flex items-center justify-center">
                <div class="relative h-[200px] w-[200px]">
                  <!-- This would be replaced with an actual chart component -->
                  <svg viewBox="0 0 100 100" class="h-full w-full">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="hsl(var(--primary))" stroke-width="20" stroke-dasharray="75 25" stroke-dashoffset="25" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="hsl(var(--primary)/0.7)" stroke-width="20" stroke-dasharray="50 50" stroke-dashoffset="0" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="hsl(var(--primary)/0.4)" stroke-width="20" stroke-dasharray="25 75" stroke-dashoffset="75" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Campaigns Table -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-lg font-semibold leading-none tracking-tight">Recent Campaigns</h3>
            <p class="text-sm text-muted-foreground">Your most recent email campaigns and their performance</p>
          </div>
          <div class="p-0">
            <div class="relative w-full overflow-auto">
              <table class="w-full caption-bottom text-sm">
                <thead class="[&_tr]:border-b">
                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Campaign</th>
                  <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sent</th>
                  <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Open Rate</th>
                  <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Click Rate</th>
                  <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
                </thead>
                <tbody class="[&_tr:last-child]:border-0">
                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td class="p-4 align-middle">Spring Sale Announcement</td>
                  <td class="p-4 align-middle">
                      <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-500/10 text-emerald-500">
                        Completed
                      </span>
                  </td>
                  <td class="p-4 align-middle">10,432</td>
                  <td class="p-4 align-middle">26.7%</td>
                  <td class="p-4 align-middle">7.2%</td>
                  <td class="p-4 align-middle text-right">
                    <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                      View Report
                    </button>
                  </td>
                </tr>
                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td class="p-4 align-middle">New Product Launch</td>
                  <td class="p-4 align-middle">
                      <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-500/10 text-emerald-500">
                        Completed
                      </span>
                  </td>
                  <td class="p-4 align-middle">8,745</td>
                  <td class="p-4 align-middle">31.2%</td>
                  <td class="p-4 align-middle">9.8%</td>
                  <td class="p-4 align-middle text-right">
                    <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                      View Report
                    </button>
                  </td>
                </tr>
                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td class="p-4 align-middle">Weekly Newsletter</td>
                  <td class="p-4 align-middle">
                      <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-500/10 text-blue-500">
                        Sending
                      </span>
                  </td>
                  <td class="p-4 align-middle">11,203</td>
                  <td class="p-4 align-middle">18.5%</td>
                  <td class="p-4 align-middle">4.3%</td>
                  <td class="p-4 align-middle text-right">
                    <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                      View Progress
                    </button>
                  </td>
                </tr>
                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td class="p-4 align-middle">Customer Feedback Survey</td>
                  <td class="p-4 align-middle">
                      <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-amber-500/10 text-amber-500">
                        Draft
                      </span>
                  </td>
                  <td class="p-4 align-middle">-</td>
                  <td class="p-4 align-middle">-</td>
                  <td class="p-4 align-middle">-</td>
                  <td class="p-4 align-middle text-right">
                    <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                      Edit Draft
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="flex items-center justify-end p-4">
            <div class="flex items-center space-x-2">
              <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                Previous
              </button>
              <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                Next
              </button>
            </div>
          </div>
        </div>

        <!-- Email Templates Section -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold leading-none tracking-tight">Email Templates</h3>
                <p class="text-sm text-muted-foreground">Your saved email templates</p>
              </div>
              <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                <PlusIcon class="mr-2 h-4 w-4" />
                New Template
              </button>
            </div>
          </div>
          <div class="p-6 pt-0">
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div class="flex flex-col space-y-1.5 p-6">
                  <div class="aspect-video rounded-md bg-muted/50 flex items-center justify-center">
                    <LayoutTemplateIcon class="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 class="text-lg font-semibold leading-none tracking-tight mt-4">Welcome Email</h3>
                  <p class="text-sm text-muted-foreground">Sent to new subscribers</p>
                </div>
                <div class="flex items-center p-6 pt-0">
                  <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                    Edit
                  </button>
                  <button class="ml-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                    Preview
                  </button>
                  <button class="ml-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">
                    <MoreHorizontalIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div class="flex flex-col space-y-1.5 p-6">
                  <div class="aspect-video rounded-md bg-muted/50 flex items-center justify-center">
                    <LayoutTemplateIcon class="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 class="text-lg font-semibold leading-none tracking-tight mt-4">Monthly Newsletter</h3>
                  <p class="text-sm text-muted-foreground">Regular updates for subscribers</p>
                </div>
                <div class="flex items-center p-6 pt-0">
                  <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                    Edit
                  </button>
                  <button class="ml-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                    Preview
                  </button>
                  <button class="ml-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">
                    <MoreHorizontalIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div class="flex flex-col space-y-1.5 p-6">
                  <div class="aspect-video rounded-md bg-muted/50 flex items-center justify-center">
                    <LayoutTemplateIcon class="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 class="text-lg font-semibold leading-none tracking-tight mt-4">Promotional</h3>
                  <p class="text-sm text-muted-foreground">Special offers and discounts</p>
                </div>
                <div class="flex items-center p-6 pt-0">
                  <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                    Edit
                  </button>
                  <button class="ml-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                    Preview
                  </button>
                  <button class="ml-auto inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">
                    <MoreHorizontalIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  ArrowRightIcon,
  BarChartIcon,
  BellIcon,
  FolderIcon,
  EyeIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  MoreHorizontalIcon,
  MousePointerClickIcon,
  PlusIcon,
  SettingsIcon,
  BookTemplateIcon,
  UsersIcon
} from 'lucide-vue-next';

// Component state would go here
// For a real implementation, you would fetch this data from an API
</script>

<style>
/* Base variables for light mode */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}

/* Dark mode variables */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
}

/* Apply base styles */
body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-feature-settings: "rlig" 1, "calt" 1;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Chart styling */
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}

/* Animation for hover states */
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.02);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--muted));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
