<template>
  <div class="flex h-full flex-col">
    <!-- Page Header -->
    <header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="flex h-14 items-center gap-4 px-4 sm:px-6">
        <h1 class="text-lg font-semibold">Campaigns</h1>
        <div class="ml-auto flex items-center gap-2">
          <div class="relative">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
                type="search"
                v-model="searchQuery"
                placeholder="Search campaigns..."
                class="h-9 w-[180px] rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-[240px]"
            />
          </div>
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
            <PlusIcon class="mr-2 h-4 w-4" />
            New Campaign
          </button>
        </div>
      </div>
    </header>

    <!-- Data Table Controls -->
    <div class="border-b px-4 py-3 sm:px-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <!-- Bulk Actions (visible when rows are selected) -->
        <div v-if="selectedRows.length > 0" class="flex items-center gap-2">
          <span class="text-sm font-medium">{{ selectedRows.length }} selected</span>
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
            <CopyIcon class="mr-2 h-4 w-4" />
            Duplicate
          </button>
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
            <ArchiveIcon class="mr-2 h-4 w-4" />
            Archive
          </button>
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-3">
            <TrashIcon class="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>

        <!-- Filters -->
        <div v-else class="flex flex-1 items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <div class="inline-flex items-center rounded-md border border-input bg-background px-3 h-9">
            <span class="text-sm text-muted-foreground mr-2">Status:</span>
            <select v-model="statusFilter" class="h-full border-0 bg-transparent text-sm focus:outline-none focus:ring-0">
              <option value="all">All Campaigns</option>
              <option value="draft">Drafts</option>
              <option value="scheduled">Scheduled</option>
              <option value="sending">Sending</option>
              <option value="sent">Sent</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div class="inline-flex items-center rounded-md border border-input bg-background px-3 h-9">
            <span class="text-sm text-muted-foreground mr-2">Date:</span>
            <select v-model="dateFilter" class="h-full border-0 bg-transparent text-sm focus:outline-none focus:ring-0">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
            <FilterIcon class="mr-2 h-4 w-4" />
            More Filters
          </button>
        </div>

        <!-- Table Controls -->
        <div class="flex items-center gap-2">
          <button
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              @click="showColumnSettings = !showColumnSettings"
          >
            <SlidersHorizontalIcon class="mr-2 h-4 w-4" />
            Columns
          </button>
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
            <DownloadIcon class="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <!-- Column Settings Dropdown -->
      <div v-if="showColumnSettings" class="mt-2 rounded-md border bg-card p-4 shadow-md">
        <h4 class="mb-2 text-sm font-medium">Customize Columns</h4>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          <label v-for="column in allColumns" :key="column.key" class="flex items-center gap-2">
            <input
                type="checkbox"
                :checked="visibleColumns.includes(column.key)"
                @change="toggleColumn(column.key)"
                class="h-4 w-4 rounded border-input bg-background"
            />
            <span class="text-sm">{{ column.label }}</span>
          </label>
        </div>
      </div>

      <!-- Active Filters (if any) -->
      <div v-if="activeFilters.length > 0" class="mt-2 flex flex-wrap gap-2">
        <div v-for="filter in activeFilters" :key="filter.id" class="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs">
          <span>{{ filter.label }}: <strong>{{ filter.value }}</strong></span>
          <button class="ml-1 rounded-full hover:bg-accent-foreground/10" @click="removeFilter(filter.id)">
            <XIcon class="h-3 w-3" />
          </button>
        </div>
        <button class="text-xs text-primary hover:underline" @click="clearAllFilters">
          Clear all filters
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="flex-1 overflow-auto">
      <table class="w-full border-collapse">
        <!-- Table Header -->
        <thead class="sticky top-0 z-10 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/30">
        <tr>
          <th class="w-[40px] px-4 py-3 text-left">
            <div class="flex items-center">
              <input
                  type="checkbox"
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @change="toggleSelectAll"
                  class="h-4 w-4 rounded border-input bg-background"
              />
            </div>
          </th>
          <th
              v-for="column in visibleColumnsData"
              :key="column.key"
              class="px-4 py-3 text-left"
              :class="{
                'cursor-pointer hover:bg-muted': column.sortable,
                'hidden sm:table-cell': column.responsiveHide === 'sm',
                'hidden md:table-cell': column.responsiveHide === 'md',
                'hidden lg:table-cell': column.responsiveHide === 'lg'
              }"
              @click="column.sortable ? sortBy(column.key) : null"
          >
            <div class="flex items-center gap-1">
              <span class="text-sm font-medium text-muted-foreground">{{ column.label }}</span>
              <div v-if="column.sortable" class="flex flex-col">
                <ChevronUpIcon
                    class="h-3 w-3"
                    :class="{ 'text-foreground': sortColumn === column.key && sortDirection === 'asc', 'text-muted-foreground/30': sortColumn !== column.key || sortDirection !== 'asc' }"
                />
                <ChevronDownIcon
                    class="h-3 w-3 -mt-1"
                    :class="{ 'text-foreground': sortColumn === column.key && sortDirection === 'desc', 'text-muted-foreground/30': sortColumn !== column.key || sortDirection !== 'desc' }"
                />
              </div>
            </div>
          </th>
          <th class="w-[100px] px-4 py-3 text-right">
            <span class="text-sm font-medium text-muted-foreground">Actions</span>
          </th>
        </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
        <template v-for="(campaign, index) in filteredCampaigns" :key="campaign.id">
          <!-- Main Row -->
          <tr
              class="group border-b transition-colors hover:bg-muted/50"
              :class="{ 'bg-muted/30': selectedRows.includes(campaign.id) }"
          >
            <td class="px-4 py-3">
              <div class="flex items-center">
                <input
                    type="checkbox"
                    :checked="selectedRows.includes(campaign.id)"
                    @change="toggleRowSelection(campaign.id)"
                    class="h-4 w-4 rounded border-input bg-background"
                />
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <button
                    class="flex h-5 w-5 items-center justify-center rounded-full border border-input bg-background"
                    @click="toggleExpandRow(campaign.id)"
                >
                  <ChevronRightIcon
                      class="h-3 w-3 transition-transform"
                      :class="{ 'rotate-90': expandedRows.includes(campaign.id) }"
                  />
                </button>
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 overflow-hidden rounded bg-muted flex items-center justify-center">
                    <img v-if="campaign.thumbnail" :src="campaign.thumbnail" alt="Campaign preview" class="h-full w-full object-cover" />
                    <MailIcon v-else class="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <div>
                    <div class="font-medium">{{ campaign.name }}</div>
                    <div class="text-xs text-muted-foreground truncate max-w-[200px]">{{ campaign.subject }}</div>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
                <span
                    class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                    :class="{
                    'border-transparent bg-amber-500/10 text-amber-500': campaign.status === 'draft',
                    'border-transparent bg-blue-500/10 text-blue-500': campaign.status === 'scheduled',
                    'border-transparent bg-emerald-500/10 text-emerald-500': campaign.status === 'sent',
                    'border-transparent bg-purple-500/10 text-purple-500': campaign.status === 'sending',
                    'border-transparent bg-slate-500/10 text-slate-500': campaign.status === 'archived',
                  }"
                >
                  {{ campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1) }}
                </span>
            </td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <div v-if="campaign.status === 'scheduled'">
                <div class="flex items-center gap-1">
                  <CalendarIcon class="h-3 w-3 text-muted-foreground" />
                  <span>{{ campaign.scheduledDate }}</span>
                </div>
                <div class="text-xs text-muted-foreground">{{ campaign.scheduledTime }}</div>
              </div>
              <div v-else-if="campaign.status === 'sent'">
                {{ campaign.sentDate }}
              </div>
              <div v-else>
                {{ campaign.createdDate }}
              </div>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">{{ campaign.recipients.toLocaleString() }}</td>
            <td class="px-4 py-3 hidden md:table-cell">
              <div v-if="campaign.status === 'sent' || campaign.status === 'sending'">
                <div class="flex items-center gap-2">
                  <div class="h-2 w-16 rounded-full bg-muted">
                    <div
                        class="h-full rounded-full bg-primary"
                        :style="{ width: `${campaign.openRate}%` }"
                        :class="{ 'bg-emerald-500': campaign.openRate > 25, 'bg-amber-500': campaign.openRate <= 25 && campaign.openRate > 15 }"
                    ></div>
                  </div>
                  <span>{{ campaign.openRate }}%</span>
                </div>
              </div>
              <div v-else>-</div>
            </td>
            <td class="px-4 py-3 hidden lg:table-cell">
              <div v-if="campaign.status === 'sent' || campaign.status === 'sending'">
                <div class="flex items-center gap-2">
                  <div class="h-2 w-16 rounded-full bg-muted">
                    <div
                        class="h-full rounded-full bg-primary"
                        :style="{ width: `${campaign.clickRate * 3}%` }"
                        :class="{ 'bg-emerald-500': campaign.clickRate > 8, 'bg-amber-500': campaign.clickRate <= 8 && campaign.clickRate > 4 }"
                    ></div>
                  </div>
                  <span>{{ campaign.clickRate }}%</span>
                </div>
              </div>
              <div v-else>-</div>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                    class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                    :class="{
                      'bg-primary text-primary-foreground hover:bg-primary/90': campaign.status === 'draft',
                    }"
                >
                  {{ getCampaignPrimaryAction(campaign.status) }}
                </button>
                <div class="relative">
                  <button
                      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
                      @click="toggleActionMenu(campaign.id)"
                  >
                    <MoreHorizontalIcon class="h-4 w-4" />
                  </button>

                  <!-- Action Menu Dropdown -->
                  <div
                      v-if="actionMenuOpen === campaign.id"
                      class="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border bg-card p-1 shadow-md"
                  >
                    <button class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
                      <CopyIcon class="h-4 w-4" />
                      <span>Duplicate</span>
                    </button>
                    <button class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
                      <ArchiveIcon class="h-4 w-4" />
                      <span>Archive</span>
                    </button>
                    <div class="my-1 h-px bg-border"></div>
                    <button class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10">
                      <TrashIcon class="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <!-- Expanded Row Details -->
          <tr v-if="expandedRows.includes(campaign.id)" class="border-b bg-muted/20">
            <td class="py-3"></td>
            <td colspan="100" class="px-4 py-3">
              <div class="rounded-md border bg-card p-4">
                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <!-- Campaign Details -->
                  <div>
                    <h4 class="mb-2 text-sm font-medium">Campaign Details</h4>
                    <dl class="grid grid-cols-[100px_1fr] gap-1 text-sm">
                      <dt class="text-muted-foreground">Created:</dt>
                      <dd>{{ campaign.createdDate }}</dd>
                      <dt class="text-muted-foreground">From Name:</dt>
                      <dd>{{ campaign.fromName || 'EmailPro Marketing' }}</dd>
                      <dt class="text-muted-foreground">Reply-to:</dt>
                      <dd>{{ campaign.replyTo || 'marketing@example.com' }}</dd>
                      <dt class="text-muted-foreground">Subject:</dt>
                      <dd>{{ campaign.subject }}</dd>
                      <dt class="text-muted-foreground">Preview:</dt>
                      <dd>{{ campaign.previewText || 'No preview text set' }}</dd>
                    </dl>
                  </div>

                  <!-- Recipients -->
                  <div>
                    <h4 class="mb-2 text-sm font-medium">Recipients</h4>
                    <dl class="grid grid-cols-[100px_1fr] gap-1 text-sm">
                      <dt class="text-muted-foreground">List:</dt>
                      <dd>{{ campaign.list || 'Main Subscribers' }}</dd>
                      <dt class="text-muted-foreground">Segments:</dt>
                      <dd>{{ campaign.segments || 'All Subscribers' }}</dd>
                      <dt class="text-muted-foreground">Total:</dt>
                      <dd>{{ campaign.recipients.toLocaleString() }} recipients</dd>
                    </dl>
                  </div>

                  <!-- Performance (if sent) -->
                  <div v-if="campaign.status === 'sent' || campaign.status === 'sending'">
                    <h4 class="mb-2 text-sm font-medium">Performance</h4>
                    <dl class="grid grid-cols-[100px_1fr] gap-1 text-sm">
                      <dt class="text-muted-foreground">Delivered:</dt>
                      <dd>{{ campaign.deliveryRate || '98.7' }}%</dd>
                      <dt class="text-muted-foreground">Opens:</dt>
                      <dd>{{ campaign.openRate }}% ({{ Math.round(campaign.recipients * campaign.openRate / 100).toLocaleString() }})</dd>
                      <dt class="text-muted-foreground">Clicks:</dt>
                      <dd>{{ campaign.clickRate }}% ({{ Math.round(campaign.recipients * campaign.clickRate / 100).toLocaleString() }})</dd>
                      <dt class="text-muted-foreground">Unsubscribes:</dt>
                      <dd>{{ campaign.unsubscribeRate || '0.2' }}% ({{ Math.round(campaign.recipients * (campaign.unsubscribeRate || 0.2) / 100).toLocaleString() }})</dd>
                    </dl>
                  </div>

                  <!-- Schedule Info (if scheduled) -->
                  <div v-if="campaign.status === 'scheduled'">
                    <h4 class="mb-2 text-sm font-medium">Schedule</h4>
                    <dl class="grid grid-cols-[100px_1fr] gap-1 text-sm">
                      <dt class="text-muted-foreground">Date:</dt>
                      <dd>{{ campaign.scheduledDate }}</dd>
                      <dt class="text-muted-foreground">Time:</dt>
                      <dd>{{ campaign.scheduledTime }}</dd>
                      <dt class="text-muted-foreground">Timezone:</dt>
                      <dd>{{ campaign.timezone || 'UTC-05:00 (Eastern Time)' }}</dd>
                    </dl>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-4 flex items-center gap-2">
                  <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                    {{ getCampaignPrimaryAction(campaign.status) }}
                  </button>
                  <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                    <EyeIcon class="mr-2 h-4 w-4" />
                    Preview
                  </button>
                  <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                    <CopyIcon class="mr-2 h-4 w-4" />
                    Duplicate
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </template>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredCampaigns.length === 0" class="flex h-[400px] flex-col items-center justify-center p-8 text-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <MailIcon class="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 class="mt-4 text-lg font-semibold">No campaigns found</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ searchQuery ? 'Try adjusting your search or filters.' : 'Get started by creating your first email campaign.' }}
        </p>
        <button v-if="!searchQuery" class="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
          <PlusIcon class="mr-2 h-4 w-4" />
          New Campaign
        </button>
        <button v-else class="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
          <XIcon class="mr-2 h-4 w-4" />
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="border-t px-4 py-2 sm:px-6">
      <div class="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p class="text-sm text-muted-foreground">
          Showing <strong>1-{{ Math.min(filteredCampaigns.length, 10) }}</strong> of <strong>{{ filteredCampaigns.length }}</strong> campaigns
        </p>
        <div class="flex items-center gap-1">
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8" :disabled="currentPage === 1">
            <ChevronLeftIcon class="h-4 w-4" />
          </button>
          <button
              v-for="page in paginationPages"
              :key="page"
              class="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-accent"
              :class="{ 'bg-primary text-primary-foreground hover:bg-primary/90': currentPage === page }"
          >
            {{ page }}
          </button>
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8" :disabled="currentPage === totalPages">
            <ChevronRightIcon class="h-4 w-4" />
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">Rows per page:</span>
          <select v-model="pageSize" class="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArchiveIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  FilterIcon,
  MailIcon,
  MoreHorizontalIcon,
  PlusIcon,
  Search,
  SlidersHorizontalIcon,
  TrashIcon,
  XIcon
} from 'lucide-vue-next';

// Table state
const searchQuery = ref('');
const statusFilter = ref('all');
const dateFilter = ref('all');
const sortColumn = ref('name');
const sortDirection = ref('asc');
const currentPage = ref(1);
const pageSize = ref(10);
const selectedRows = ref<number[]>([]);
const expandedRows = ref<number[]>([]);
const actionMenuOpen = ref<number | null>(null);
const showColumnSettings = ref(false);

// Column definitions
const allColumns = [
  { key: 'name', label: 'Campaign', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'date', label: 'Date', sortable: true, responsiveHide: 'sm' },
  { key: 'recipients', label: 'Recipients', sortable: true, responsiveHide: 'md' },
  { key: 'openRate', label: 'Open Rate', sortable: true, responsiveHide: 'md' },
  { key: 'clickRate', label: 'Click Rate', sortable: true, responsiveHide: 'lg' },
];

// Visible columns
const visibleColumns = ref(['name', 'status', 'date', 'recipients', 'openRate', 'clickRate']);

// Get visible column data
const visibleColumnsData = computed(() => {
  return allColumns.filter(column => visibleColumns.value.includes(column.key));
});

// Toggle column visibility
const toggleColumn = (columnKey: string) => {
  if (visibleColumns.value.includes(columnKey)) {
    // Don't allow removing the name column
    if (columnKey === 'name') return;
    visibleColumns.value = visibleColumns.value.filter(key => key !== columnKey);
  } else {
    visibleColumns.value.push(columnKey);
  }
};

// Active filters
const activeFilters = ref([
  { id: 1, label: 'Status', value: 'All' },
]);

// Remove a filter
const removeFilter = (id: number) => {
  activeFilters.value = activeFilters.value.filter(filter => filter.id !== id);
};

// Clear all filters
const clearAllFilters = () => {
  activeFilters.value = [];
  statusFilter.value = 'all';
  dateFilter.value = 'all';
  searchQuery.value = '';
};

// Toggle row selection
const toggleRowSelection = (id: number) => {
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter(rowId => rowId !== id);
  } else {
    selectedRows.value.push(id);
  }
};

// Toggle select all rows
const toggleSelectAll = () => {
  if (selectedRows.value.length === filteredCampaigns.value.length) {
    selectedRows.value = [];
  } else {
    selectedRows.value = filteredCampaigns.value.map(campaign => campaign.id);
  }
};

// Check if all rows are selected
const isAllSelected = computed(() => {
  return filteredCampaigns.value.length > 0 && selectedRows.value.length === filteredCampaigns.value.length;
});

// Check if some rows are selected
const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < filteredCampaigns.value.length;
});

// Toggle row expansion
const toggleExpandRow = (id: number) => {
  if (expandedRows.value.includes(id)) {
    expandedRows.value = expandedRows.value.filter(rowId => rowId !== id);
  } else {
    expandedRows.value.push(id);
  }
};

// Toggle action menu
const toggleActionMenu = (id: number) => {
  if (actionMenuOpen.value === id) {
    actionMenuOpen.value = null;
  } else {
    actionMenuOpen.value = id;
  }
};

// Sort campaigns
const sortBy = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

// Helper function to get the primary action based on campaign status
const getCampaignPrimaryAction = (status: string) => {
  switch (status) {
    case 'draft':
      return 'Edit';
    case 'scheduled':
      return 'Reschedule';
    case 'sending':
      return 'View Progress';
    case 'sent':
      return 'View Report';
    default:
      return 'View';
  }
};

// Filtered campaigns based on search and filters
const filteredCampaigns = computed(() => {
  let result = [...campaigns.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(campaign =>
        campaign.name.toLowerCase().includes(query) ||
        campaign.subject.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(campaign => campaign.status === statusFilter.value);
  }

  // Apply date filter (simplified for demo)
  if (dateFilter.value !== 'all') {
    // In a real app, you would filter by date range
  }

  // Apply sorting
  result.sort((a, b) => {
    let valueA, valueB;

    switch (sortColumn.value) {
      case 'name':
        valueA = a.name;
        valueB = b.name;
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      case 'date':
        valueA = a.status === 'sent' ? a.sentDate : a.createdDate;
        valueB = b.status === 'sent' ? b.sentDate : b.createdDate;
        break;
      case 'recipients':
        valueA = a.recipients;
        valueB = b.recipients;
        break;
      case 'openRate':
        valueA = a.openRate || 0;
        valueB = b.openRate || 0;
        break;
      case 'clickRate':
        valueA = a.clickRate || 0;
        valueB = b.clickRate || 0;
        break;
      default:
        valueA = a.name;
        valueB = b.name;
    }

    if (sortDirection.value === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  return result;
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredCampaigns.value.length / pageSize.value));

// Generate pagination pages array
const paginationPages = computed(() => {
  const pages = [];
  const maxPages = 5;

  if (totalPages.value <= maxPages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    // Calculate start and end of page range
    let start = Math.max(2, currentPage.value - 1);
    let end = Math.min(totalPages.value - 1, start + 2);

    // Adjust if at the end
    if (end === totalPages.value - 1) {
      start = Math.max(2, end - 2);
    }

    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...');
    }

    // Add page range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (end < totalPages.value - 1) {
      pages.push('...');
    }

    // Always show last page
    pages.push(totalPages.value);
  }

  return pages;
});

// Sample campaign data
const campaigns = ref([
  {
    id: 1,
    name: 'Spring Sale Announcement',
    subject: 'Don\'t Miss Our Spring Sale - Up to 50% Off!',
    status: 'sent',
    createdDate: 'Mar 15, 2024',
    sentDate: 'Mar 18, 2024',
    recipients: 10432,
    openRate: 26.7,
    clickRate: 7.2,
    thumbnail: '/placeholder.svg?height=200&width=400',
    fromName: 'Marketing Team',
    replyTo: 'marketing@example.com',
    previewText: 'Spring has sprung with amazing deals!',
    list: 'Main Subscribers',
    segments: 'Active Customers',
    deliveryRate: 99.2,
    unsubscribeRate: 0.3
  },
  {
    id: 2,
    name: 'New Product Launch',
    subject: 'Introducing Our Latest Innovation',
    status: 'sent',
    createdDate: 'Mar 10, 2024',
    sentDate: 'Mar 12, 2024',
    recipients: 8745,
    openRate: 31.2,
    clickRate: 9.8,
    thumbnail: '/placeholder.svg?height=200&width=400',
    fromName: 'Product Team',
    replyTo: 'products@example.com',
    previewText: 'Meet our newest product that will change everything',
    list: 'All Subscribers',
    segments: 'Product Enthusiasts',
    deliveryRate: 98.7,
    unsubscribeRate: 0.1
  },
  {
    id: 3,
    name: 'Weekly Newsletter',
    subject: 'Your Weekly Update: Latest News and Trends',
    status: 'sending',
    createdDate: 'Mar 20, 2024',
    progress: 68,
    recipients: 11203,
    openRate: 18.5,
    clickRate: 4.3,
    thumbnail: '/placeholder.svg?height=200&width=400',
    fromName: 'Newsletter Team',
    replyTo: 'newsletter@example.com',
    previewText: 'Your weekly dose of industry news and updates',
    list: 'Newsletter Subscribers',
    segments: 'All Segments',
    deliveryRate: 97.5,
    unsubscribeRate: 0.4
  },
  {
    id: 4,
    name: 'Customer Feedback Survey',
    subject: 'We Value Your Opinion - Take Our Quick Survey',
    status: 'draft',
    createdDate: 'Mar 22, 2024',
    recipients: 9500,
    openRate: 0,
    clickRate: 0,
    thumbnail: null,
    fromName: 'Customer Success',
    replyTo: 'feedback@example.com',
    previewText: 'Help us improve with your valuable feedback',
    list: 'Active Customers',
    segments: '3+ Purchases'
  },
  {
    id: 5,
    name: 'Summer Collection Preview',
    subject: 'Be the First to See Our Summer Collection',
    status: 'scheduled',
    createdDate: 'Mar 23, 2024',
    scheduledDate: 'Apr 5, 2024',
    scheduledTime: '9:00 AM',
    recipients: 12500,
    openRate: 0,
    clickRate: 0,
    thumbnail: '/placeholder.svg?height=200&width=400',
    fromName: 'Style Team',
    replyTo: 'style@example.com',
    previewText: 'Summer is coming - see what\'s hot this season',
    list: 'Fashion Subscribers',
    segments: 'Previous Purchasers',
    timezone: 'UTC-05:00 (Eastern Time)'
  },
  {
    id: 6,
    name: 'Exclusive Member Discount',
    subject: 'A Special Offer Just for Our Members',
    status: 'draft',
    createdDate: 'Mar 24, 2024',
    recipients: 7800,
    openRate: 0,
    clickRate: 0,
    thumbnail: null,
    fromName: 'Member Benefits',
    replyTo: 'members@example.com',
    previewText: 'Your exclusive member discount awaits inside',
    list: 'Premium Members',
    segments: 'All Premium Members'
  },
  {
    id: 7,
    name: 'Holiday Special',
    subject: 'Celebrate the Holidays with These Amazing Deals',
    status: 'archived',
    createdDate: 'Dec 10, 2023',
    sentDate: 'Dec 15, 2023',
    recipients: 15320,
    openRate: 29.4,
    clickRate: 8.7,
    thumbnail: '/placeholder.svg?height=200&width=400',
    fromName: 'Holiday Team',
    replyTo: 'holidays@example.com',
    previewText: 'Unwrap special holiday savings inside!',
    list: 'All Subscribers',
    segments: 'All Segments',
    deliveryRate: 99.1,
    unsubscribeRate: 0.2
  }
]);
</script>

<style scoped>
/* Add any additional custom styling here */
</style>
