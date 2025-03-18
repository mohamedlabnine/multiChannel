<template>
  <div class="flex h-full">
    <!-- Sidebar for adding/editing SMS campaigns -->
    <div 
      class="fixed inset-y-0 right-0 z-20 flex w-full md:w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out"
      :class="showEditSidebar ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex h-14 items-center justify-between border-b px-4">
        <h2 class="text-lg font-semibold">{{ editingCampaign ? 'Edit SMS Campaign' : 'New SMS Campaign' }}</h2>
        <button 
          @click="closeEditSidebar" 
          class="rounded-full p-1 hover:bg-muted"
        >
          <XIcon class="h-5 w-5" />
        </button>
      </div>
      
      <!-- Campaign Form -->
      <div class="flex-1 overflow-auto p-4">
        <form @submit.prevent="saveCampaign" class="space-y-6 max-w-3xl mx-auto">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-muted-foreground">Campaign Details</h3>
            
            <div class="space-y-2">
              <label for="campaignName" class="text-sm font-medium">Campaign Name</label>
              <input 
                id="campaignName" 
                v-model="campaign.name" 
                type="text" 
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter campaign name"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label for="fromNumber" class="text-sm font-medium">From Number</label>
              <select 
                id="fromNumber" 
                v-model="campaign.fromNumber" 
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="+15551234567">+1 (555) 123-4567</option>
                <option value="+15559876543">+1 (555) 987-6543</option>
                <option value="+15552223333">+1 (555) 222-3333</option>
              </select>
              <p class="text-xs text-muted-foreground">This is the number that will appear as the sender</p>
            </div>
            
            <div class="space-y-2">
              <label for="recipients" class="text-sm font-medium">Recipients</label>
              <select 
                id="recipients" 
                v-model="campaign.recipientList" 
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="all">All Subscribers (12,450)</option>
                <option value="active">Active Customers (8,320)</option>
                <option value="recent">Recent Purchasers (3,150)</option>
                <option value="vip">VIP Members (1,275)</option>
              </select>
            </div>
          </div>
          
          <!-- Message Content -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-muted-foreground">Message Content</h3>
            
            <div class="space-y-2">
              <label for="message" class="text-sm font-medium">Message</label>
              <textarea 
                id="message" 
                v-model="campaign.message" 
                rows="5" 
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Type your SMS message here..."
                required
              ></textarea>
              <div class="flex items-center justify-between">
                <p class="text-xs text-muted-foreground">
                  <span>{{ campaign.message.length }}</span>/160 characters 
                  ({{ Math.ceil(campaign.message.length / 160) }} SMS)
                </p>
                <button type="button" class="text-xs text-primary hover:underline">
                  Add Personalization
                </button>
              </div>
            </div>
            
            <!-- URL Shortening -->
            <div class="rounded-md border p-4">
              <div class="flex items-start gap-2">
                <div class="mt-1">
                  <input 
                    type="checkbox" 
                    id="shortenUrls" 
                    v-model="campaign.shortenUrls" 
                    class="h-4 w-4 rounded border-input"
                  />
                </div>
                <div>
                  <label for="shortenUrls" class="text-sm font-medium">Automatically shorten URLs</label>
                  <p class="text-xs text-muted-foreground">
                    URLs in your message will be shortened to save characters and enable click tracking
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Opt-out Message -->
            <div class="rounded-md border p-4">
              <div class="flex items-start gap-2">
                <div class="mt-1">
                  <input 
                    type="checkbox" 
                    id="addOptout" 
                    v-model="campaign.addOptout" 
                    class="h-4 w-4 rounded border-input"
                  />
                </div>
                <div>
                  <label for="addOptout" class="text-sm font-medium">Include opt-out instructions</label>
                  <p class="text-xs text-muted-foreground">
                    Automatically append "Reply STOP to opt out" to your message (required in many countries)
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Schedule -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-muted-foreground">Schedule</h3>
            
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <input 
                  type="radio" 
                  id="sendNow" 
                  name="schedule" 
                  :value="false" 
                  v-model="campaign.scheduled" 
                  class="h-4 w-4"
                />
                <label for="sendNow" class="text-sm">Send immediately</label>
              </div>
              <div class="flex items-center gap-2">
                <input 
                  type="radio" 
                  id="sendLater" 
                  name="schedule" 
                  :value="true" 
                  v-model="campaign.scheduled" 
                  class="h-4 w-4"
                />
                <label for="sendLater" class="text-sm">Schedule for later</label>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="scheduleDate" class="text-sm font-medium">Date</label>
                <input 
                  id="scheduleDate" 
                  type="date" 
                  v-model="campaign.scheduleDate" 
                  :disabled="!campaign.scheduled"
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                />
              </div>
              <div class="space-y-2">
                <label for="scheduleTime" class="text-sm font-medium">Time</label>
                <input 
                  id="scheduleTime" 
                  type="time" 
                  v-model="campaign.scheduleTime" 
                  :disabled="!campaign.scheduled"
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                />
              </div>
            </div>
            
            <div class="space-y-2">
              <label for="timezone" class="text-sm font-medium">Timezone</label>
              <select 
                id="timezone" 
                v-model="campaign.timezone" 
                :disabled="!campaign.scheduled"
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              >
                <option value="UTC-05:00">UTC-05:00 (Eastern Time)</option>
                <option value="UTC-06:00">UTC-06:00 (Central Time)</option>
                <option value="UTC-07:00">UTC-07:00 (Mountain Time)</option>
                <option value="UTC-08:00">UTC-08:00 (Pacific Time)</option>
              </select>
            </div>
          </div>
          
          <!-- Preview -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-muted-foreground">Preview</h3>
            
            <div class="rounded-md border p-4 bg-muted/20">
              <div class="flex flex-col gap-2 max-w-xs mx-auto">
                <div class="flex items-center gap-2 mb-2">
                  <div class="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <SmartphoneIcon class="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div class="text-sm font-medium">{{ campaign.fromNumber || '+1 (555) 123-4567' }}</div>
                </div>
                
                <div class="rounded-lg bg-primary/10 text-primary-foreground p-3 text-sm self-start max-w-[80%]">
                  {{ campaign.message }}
                  <span v-if="campaign.addOptout"> Reply STOP to opt out.</span>
                </div>
                
                <div class="text-xs text-muted-foreground self-start mt-1">
                  {{ new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <!-- Form Actions -->
      <div class="border-t p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium">Estimated cost: <span class="text-primary">${{ calculateCost() }}</span></p>
            <p class="text-xs text-muted-foreground">Based on {{ getRecipientCount() }} recipients at $0.01 per SMS</p>
          </div>
          <div class="flex items-center gap-2">
            <button 
              type="button" 
              @click="closeEditSidebar" 
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              Cancel
            </button>
            <button 
              type="button"
              @click="saveCampaign" 
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <SaveIcon class="mr-2 h-4 w-4" />
              {{ editingCampaign ? 'Update Campaign' : 'Create Campaign' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sidebar for viewing campaign recipients and their statuses -->
    <div 
      class="fixed inset-y-0 right-0 z-20 flex w-full md:w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out"
      :class="showViewSidebar ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex h-14 items-center justify-between border-b px-4">
        <h2 class="text-lg font-semibold">{{ viewingCampaign ? viewingCampaign.name : 'Campaign Recipients' }}</h2>
        <button 
          @click="closeViewSidebar" 
          class="rounded-full p-1 hover:bg-muted"
        >
          <XIcon class="h-5 w-5" />
        </button>
      </div>
      
      <!-- Campaign Recipients List -->
      <div class="flex-1 overflow-auto">
        <div class="p-4 border-b">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Campaign Summary</h3>
              <p class="text-sm text-muted-foreground">
                {{ viewingCampaign ? viewingCampaign.status.charAt(0).toUpperCase() + viewingCampaign.status.slice(1) : '' }} 
                • {{ viewingCampaign ? viewingCampaign.recipients.toLocaleString() : '0' }} recipients
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="editCampaign(viewingCampaign)" 
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
              >
                <PencilIcon class="mr-2 h-4 w-4" />
                Edit
              </button>
            </div>
          </div>
          
          <!-- Delivery Stats -->
          <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div class="rounded-md border p-3">
              <div class="text-sm text-muted-foreground">Delivered</div>
              <div class="mt-1 text-2xl font-semibold">
                {{ viewingCampaign ? Math.round(viewingCampaign.recipients * (viewingCampaign.deliveryRate || 0) / 100).toLocaleString() : '0' }}
              </div>
              <div class="text-xs text-muted-foreground">
                {{ viewingCampaign ? viewingCampaign.deliveryRate : '0' }}% of total
              </div>
            </div>
            <div class="rounded-md border p-3">
              <div class="text-sm text-muted-foreground">Failed</div>
              <div class="mt-1 text-2xl font-semibold">
                {{ viewingCampaign ? Math.round(viewingCampaign.recipients * (100 - (viewingCampaign.deliveryRate || 0)) / 100).toLocaleString() : '0' }}
              </div>
              <div class="text-xs text-muted-foreground">
                {{ viewingCampaign ? (100 - viewingCampaign.deliveryRate).toFixed(1) : '0' }}% of total
              </div>
            </div>
            <div class="rounded-md border p-3">
              <div class="text-sm text-muted-foreground">Responses</div>
              <div class="mt-1 text-2xl font-semibold">
                {{ viewingCampaign ? Math.round(viewingCampaign.recipients * (viewingCampaign.responseRate || 0) / 100).toLocaleString() : '0' }}
              </div>
              <div class="text-xs text-muted-foreground">
                {{ viewingCampaign ? viewingCampaign.responseRate : '0' }}% response rate
              </div>
            </div>
            <div class="rounded-md border p-3">
              <div class="text-sm text-muted-foreground">Opt-outs</div>
              <div class="mt-1 text-2xl font-semibold">
                {{ viewingCampaign ? Math.round(viewingCampaign.recipients * ((viewingCampaign.optOutRate || 0.2) / 100)).toLocaleString() : '0' }}
              </div>
              <div class="text-xs text-muted-foreground">
                {{ viewingCampaign ? (viewingCampaign.optOutRate || 0.2) : '0' }}% opt-out rate
              </div>
            </div>
          </div>
        </div>
        
        <!-- Search and Filter -->
        <div class="border-b p-4">
          <div class="flex items-center gap-2">
            <div class="relative flex-1">
              <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                v-model="recipientSearchQuery"
                placeholder="Search recipients..."
                class="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div class="inline-flex items-center rounded-md border border-input bg-background px-3 h-9">
              <span class="text-sm text-muted-foreground mr-2">Status:</span>
              <select v-model="recipientStatusFilter" class="h-full border-0 bg-transparent text-sm focus:outline-none focus:ring-0">
                <option value="all">All</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
                <option value="queued">Queued</option>
                <option value="sending">Sending</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Recipients Table -->
        <table class="w-full border-collapse">
          <thead class="sticky top-0 z-10 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/30">
            <tr>
              <th class="px-4 py-3 text-left">
                <span class="text-sm font-medium text-muted-foreground">Recipient</span>
              </th>
              <th class="px-4 py-3 text-left">
                <span class="text-sm font-medium text-muted-foreground">Status</span>
              </th>
              <th class="px-4 py-3 text-left hidden md:table-cell">
                <span class="text-sm font-medium text-muted-foreground">Time</span>
              </th>
              <th class="px-4 py-3 text-right">
                <span class="text-sm font-medium text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(recipient, index) in filteredRecipients" :key="index" class="border-b">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                    <img v-if="recipient.avatar" :src="recipient.avatar" alt="Recipient avatar" class="h-full w-full object-cover" />
                    <UserIcon v-else class="h-4 w-4 text-muted-foreground/50" />
                  </div>
                  <div>
                    <div class="font-medium">{{ recipient.name }}</div>
                    <div class="text-xs text-muted-foreground">{{ recipient.phone }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  :class="{
                    'border-transparent bg-emerald-500/10 text-emerald-500': recipient.status === 'delivered',
                    'border-transparent bg-red-500/10 text-red-500': recipient.status === 'failed',
                    'border-transparent bg-blue-500/10 text-blue-500': recipient.status === 'queued',
                    'border-transparent bg-purple-500/10 text-purple-500': recipient.status === 'sending',
                  }"
                >
                  {{ recipient.status.charAt(0).toUpperCase() + recipient.status.slice(1) }}
                </span>
              </td>
              <td class="px-4 py-3 hidden md:table-cell">
                <div class="text-sm">{{ recipient.time }}</div>
              </td>
              <td class="px-4 py-3 text-right">
                <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
                  Details
                </button>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr v-if="filteredRecipients.length === 0">
              <td colspan="4" class="px-4 py-8 text-center">
                <div class="flex flex-col items-center justify-center">
                  <UserIcon class="h-8 w-8 text-muted-foreground/50" />
                  <h3 class="mt-2 text-sm font-medium">No recipients found</h3>
                  <p class="mt-1 text-xs text-muted-foreground">
                    {{ recipientSearchQuery ? 'Try adjusting your search or filters.' : 'This campaign has no recipients yet.' }}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Sidebar Footer -->
      <div class="border-t p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">
              Showing <strong>{{ filteredRecipients.length }}</strong> of <strong>{{ campaignRecipients.length }}</strong> recipients
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button 
              type="button" 
              @click="closeViewSidebar" 
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              Close
            </button>
            <button 
              type="button"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <DownloadIcon class="mr-2 h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Overlay when sidebar is open -->
    <div 
      v-if="showEditSidebar || showViewSidebar" 
      class="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm"
      @click="closeAllSidebars"
    ></div>

    <!-- Main Content -->
    <div class="flex h-full w-full flex-col">
      <!-- Page Header -->
      <header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="flex h-14 items-center gap-4 px-4 sm:px-6">
          <h1 class="text-lg font-semibold">SMS Campaigns</h1>
          <div class="ml-auto flex items-center gap-2">
            <div class="relative">
              <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                  type="search"
                  v-model="searchQuery"
                  placeholder="Search SMS campaigns..."
                  class="h-9 w-[180px] rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-[240px]"
              />
            </div>
            <button 
              @click="openAddCampaignSidebar"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <PlusIcon class="mr-2 h-4 w-4" />
              New SMS Campaign
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
                      <SmartphoneIcon v-else class="h-5 w-5 text-muted-foreground/50" />
                    </div>
                    <div>
                      <div class="font-medium">{{ campaign.name }}</div>
                      <div class="text-xs text-muted-foreground truncate max-w-[200px]">{{ campaign.message }}</div>
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
                          :style="{ width: `${campaign.deliveryRate}%` }"
                          :class="{ 'bg-emerald-500': campaign.deliveryRate > 95, 'bg-amber-500': campaign.deliveryRate <= 95 && campaign.deliveryRate > 90 }"
                      ></div>
                    </div>
                    <span>{{ campaign.deliveryRate }}%</span>
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
                          :style="{ width: `${campaign.responseRate * 3}%` }"
                          :class="{ 'bg-emerald-500': campaign.responseRate > 8, 'bg-amber-500': campaign.responseRate <= 8 && campaign.responseRate > 4 }"
                      ></div>
                    </div>
                    <span>{{ campaign.responseRate }}%</span>
                  </div>
                </div>
                <div v-else>-</div>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                      @click="viewCampaign(campaign)"
                  >
                    View
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
                        <dt class="text-muted-foreground">From Number:</dt>
                        <dd>{{ campaign.fromNumber || '+1 (555) 123-4567' }}</dd>
                        <dt class="text-muted-foreground">Message:</dt>
                        <dd>{{ campaign.message }}</dd>
                        <dt class="text-muted-foreground">Characters:</dt>
                        <dd>{{ campaign.characters || campaign.message.length }} ({{ Math.ceil(campaign.message.length / 160) }} SMS)</dd>
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
                        <dt class="text-muted-foreground">Responses:</dt>
                        <dd>{{ campaign.responseRate }}% ({{ Math.round(campaign.recipients * campaign.responseRate / 100).toLocaleString() }})</dd>
                        <dt class="text-muted-foreground">Opt-outs:</dt>
                        <dd>{{ campaign.optOutRate || '0.2' }}% ({{ Math.round(campaign.recipients * (campaign.optOutRate || 0.2) / 100).toLocaleString() }})</dd>
                        <dt class="text-muted-foreground">Cost:</dt>
                        <dd>${{ campaign.cost || ((campaign.recipients * 0.01).toFixed(2)) }}</dd>
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
                    <button 
                      @click="viewCampaign(campaign)"
                      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                    >
                      View Recipients
                    </button>
                    <button 
                      @click="editCampaign(campaign)"
                      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                    >
                      <PencilIcon class="mr-2 h-4 w-4" />
                      Edit
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
            <SmartphoneIcon class="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 class="mt-4 text-lg font-semibold">No SMS campaigns found</h3>
          <p class="mt-2 text-sm text-muted-foreground">
            {{ searchQuery ? 'Try adjusting your search or filters.' : 'Get started by creating your first SMS campaign.' }}
          </p>
          <button 
            v-if="!searchQuery" 
            @click="openAddCampaignSidebar" 
            class="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
          >
            <PlusIcon class="mr-2 h-4 w-4" />
            New SMS Campaign
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
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  Search,
  SlidersHorizontalIcon,
  SmartphoneIcon,
  TrashIcon,
  UserIcon,
  XIcon
} from 'lucide-vue-next';

// Sidebar states
const showEditSidebar = ref(false);
const showViewSidebar = ref(false);
const editingCampaign = ref<any>(null);
const viewingCampaign = ref<any>(null);

// Campaign form data
const campaign = ref({
  name: '',
  fromNumber: '+15551234567',
  recipientList: 'all',
  message: '',
  shortenUrls: true,
  addOptout: true,
  scheduled: false,
  scheduleDate: '',
  scheduleTime: '',
  timezone: 'UTC-05:00'
});

// Recipients view data
const recipientSearchQuery = ref('');
const recipientStatusFilter = ref('all');
const campaignRecipients = ref<any[]>([]);

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
  { key: 'deliveryRate', label: 'Delivery Rate', sortable: true, responsiveHide: 'md' },
  { key: 'responseRate', label: 'Response Rate', sortable: true, responsiveHide: 'lg' },
];

// Visible columns
const visibleColumns = ref(['name', 'status', 'date', 'recipients', 'deliveryRate', 'responseRate']);

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

// Sidebar functions
const openAddCampaignSidebar = () => {
  // Reset form
  campaign.value = {
    name: '',
    fromNumber: '+15551234567',
    recipientList: 'all',
    message: '',
    shortenUrls: true,
    addOptout: true,
    scheduled: false,
    scheduleDate: '',
    scheduleTime: '',
    timezone: 'UTC-05:00'
  };
  editingCampaign.value = null;
  showEditSidebar.value = true;
  showViewSidebar.value = false;
};

const editCampaign = (campaignData: any) => {
  // Populate form with campaign data
  campaign.value = {
    name: campaignData.name,
    fromNumber: campaignData.fromNumber || '+15551234567',
    recipientList: campaignData.recipientList || 'all',
    message: campaignData.message,
    shortenUrls: campaignData.shortenUrls !== undefined ? campaignData.shortenUrls : true,
    addOptout: campaignData.addOptout !== undefined ? campaignData.addOptout : true,
    scheduled: campaignData.status === 'scheduled',
    scheduleDate: campaignData.scheduledDate || '',
    scheduleTime: campaignData.scheduledTime || '',
    timezone: campaignData.timezone || 'UTC-05:00'
  };
  
  editingCampaign.value = campaignData;
  showEditSidebar.value = true;
  showViewSidebar.value = false;
};

const viewCampaign = (campaignData: any) => {
  viewingCampaign.value = campaignData;
  showViewSidebar.value = true;
  showEditSidebar.value = false;
  
  // Generate sample recipients based on campaign status
  generateRecipients(campaignData);
};

const closeEditSidebar = () => {
  showEditSidebar.value = false;
};

const closeViewSidebar = () => {
  showViewSidebar.value = false;
};

const closeAllSidebars = () => {
  showEditSidebar.value = false;
  showViewSidebar.value = false;
};

// Helper functions
const getRecipientCount = () => {
  switch (campaign.value.recipientList) {
    case 'all': return 12450;
    case 'active': return 8320;
    case 'recent': return 3150;
    case 'vip': return 1275;
    default: return 0;
  }
};

const calculateCost = () => {
  const count = getRecipientCount();
  const cost = count * 0.01;
  return cost.toFixed(2);
};

// Generate sample recipients for a campaign
const generateRecipients = (campaignData: any) => {
  const statuses = ['delivered', 'failed', 'queued', 'sending'];
  const statusDistribution = {
    'draft': { delivered: 0, failed: 0, queued: 100, sending: 0 },
    'scheduled': { delivered: 0, failed: 0, queued: 100, sending: 0 },
    'sending': { delivered: 40, failed: 5, queued: 30, sending: 25 },
    'sent': { delivered: 95, failed: 5, queued: 0, sending: 0 },
    'archived': { delivered: 95, failed: 5, queued: 0, sending: 0 }
  };
  
  const distribution = statusDistribution[campaignData.status as keyof typeof statusDistribution];
  const recipients = [];
  
  // Generate 50 sample recipients
  const sampleSize = 50;
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'William', 'Jessica'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
  
  for (let i = 0; i < sampleSize; i++) {
    // Determine status based on distribution
    let status = 'delivered';
    const rand = Math.random() * 100;
    let cumulative = 0;
    
    for (const [stat, percentage] of Object.entries(distribution)) {
      cumulative += percentage;
      if (rand <= cumulative) {
        status = stat;
        break;
      }
    }
    
    // Generate random recipient
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const phone = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    
    // Generate time based on status
    let time;
    const now = new Date();
    
    if (status === 'delivered' || status === 'failed') {
      // Random time in the past 24 hours
      const pastTime = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
      time = pastTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else if (status === 'sending') {
      // Just now
      time = 'Just now';
    } else {
      // Queued - pending
      time = 'Pending';
    }
    
    recipients.push({
      name,
      phone,
      status,
      time,
      avatar: Math.random() > 0.7 ? `/placeholder.svg?height=100&width=100` : null
    });
  }
  
  campaignRecipients.value = recipients;
};

// Filtered recipients based on search and status filter
const filteredRecipients = computed(() => {
  let result = [...campaignRecipients.value];
  
  // Apply search filter
  if (recipientSearchQuery.value) {
    const query = recipientSearchQuery.value.toLowerCase();
    result = result.filter(recipient => 
      recipient.name.toLowerCase().includes(query) || 
      recipient.phone.includes(query)
    );
  }
  
  // Apply status filter
  if (recipientStatusFilter.value !== 'all') {
    result = result.filter(recipient => recipient.status === recipientStatusFilter.value);
  }
  
  return result;
});

// Save campaign
const saveCampaign = () => {
  if (editingCampaign.value) {
    // Update existing campaign
    const index = campaigns.value.findIndex(c => c.id === editingCampaign.value.id);
    if (index !== -1) {
      campaigns.value[index] = {
        ...editingCampaign.value,
        name: campaign.value.name,
        message: campaign.value.message,
        fromNumber: campaign.value.fromNumber,
        status: campaign.value.scheduled ? 'scheduled' : editingCampaign.value.status,
        scheduledDate: campaign.value.scheduleDate,
        scheduledTime: campaign.value.scheduleTime,
        timezone: campaign.value.timezone,
        shortenUrls: campaign.value.shortenUrls,
        addOptout: campaign.value.addOptout
      };
    }
  } else {
    // Add new campaign
    const newCampaign = {
      id: campaigns.value.length + 1,
      name: campaign.value.name,
      message: campaign.value.message,
      status: campaign.value.scheduled ? 'scheduled' : 'draft',
      createdDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      scheduledDate: campaign.value.scheduleDate,
      scheduledTime: campaign.value.scheduleTime,
      timezone: campaign.value.timezone,
      recipients: getRecipientCount(),
      deliveryRate: 0,
      responseRate: 0,
      fromNumber: campaign.value.fromNumber,
      shortenUrls: campaign.value.shortenUrls,
      addOptout: campaign.value.addOptout,
      thumbnail: null,
      characters: campaign.value.message.length
    };
    
    campaigns.value.unshift(newCampaign);
  }
  
  // Close sidebar
  closeEditSidebar();
};

// Filtered campaigns based on search and filters
const filteredCampaigns = computed(() => {
  let result = [...campaigns.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(campaign =>
        campaign.name.toLowerCase().includes(query) ||
        campaign.message.toLowerCase().includes(query)
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
      case 'deliveryRate':
        valueA = a.deliveryRate || 0;
        valueB = b.deliveryRate || 0;
        break;
      case 'responseRate':
        valueA = a.responseRate || 0;
        valueB = b.responseRate || 0;
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
    name: 'Spring Sale Promotion',
    message: 'SPRING SALE: Get 50% off all items this weekend only! Shop now at example.com/sale. Reply STOP to opt out.',
    status: 'sent',
    createdDate: 'Mar 15, 2024',
    sentDate: 'Mar 18, 2024',
    recipients: 5432,
    deliveryRate: 98.7,
    responseRate: 6.2,
    thumbnail: '/placeholder.svg?height=200&width=400',
    fromNumber: '+1 (555) 123-4567',
    list: 'Main Subscribers',
    segments: 'Active Customers',
    optOutRate: 0.3,
    cost: 543.20,
    characters: 112
  },
  {
    id: 2,
    name: 'New Product Announcement',
    message: 'Just launched! Our new product is here. Check it out: example.com/new. Limited stock available! Reply STOP to opt out.',
    status: 'sent',
    createdDate: 'Mar 10, 2024',
    sentDate: 'Mar 12, 2024',
    recipients: 4745,
    deliveryRate: 97.5,
    responseRate: 8.3,
    thumbnail: '/placeholder.svg?height=200&width=400',
    fromNumber: '+1 (555) 123-4567',
    list: 'All Subscribers',
    segments: 'Product Enthusiasts',
    optOutRate: 0.2,
    cost: 474.50,
    characters: 120
  },
  {
    id: 3,
    name: 'Appointment Reminder',
    message: 'Reminder: Your appointment is tomorrow at 2:00 PM. Reply C to confirm or R to reschedule. Questions? Call (555) 987-6543.',
    status: 'sending',
    createdDate: 'Mar 20, 2024',
    progress: 68,
    recipients: 1203,
    deliveryRate: 95.2,
    responseRate: 12.5,
    thumbnail: '/placeholder.svg?height=200&width=400',
    fromNumber: '+1 (555) 123-4567',
    list: 'Appointment Customers',
    segments: 'All Segments',
    optOutRate: 0.1,
    cost: 120.30,
    characters: 118
  },
  {
    id: 4,
    name: 'Customer Feedback Request',
    message: 'We value your opinion! Rate your recent experience with us from 1-5. Respond with your rating to get 10% off your next purchase.',
    status: 'draft',
    createdDate: 'Mar 22, 2024',
    recipients: 3500,
    deliveryRate: 0,
    responseRate: 0,
    thumbnail: null,
    fromNumber: '+1 (555) 123-4567',
    list: 'Active Customers',
    segments: '3+ Purchases',
    characters: 132
  },
  {
    id: 5,
    name: 'Flash Sale Alert',
    message: 'FLASH SALE: Today only! 30% off everything. Use code SMS30 at checkout: example.com. Valid until midnight. Reply STOP to opt out.',
    status: 'scheduled',
    createdDate: 'Mar 23, 2024',
    scheduledDate: 'Apr 5, 2024',
    scheduledTime: '9:00 AM',
    recipients: 6500,
    deliveryRate: 0,
    responseRate: 0,
    thumbnail: '/placeholder.svg?height=200&width=400',
    fromNumber: '+1 (555) 123-4567',
    list: 'Sales Subscribers',
    segments: 'Previous Purchasers',
    timezone: 'UTC-05:00 (Eastern Time)',
    characters: 125
  },
  {
    id: 6,
    name: 'Exclusive Member Offer',
    message: 'VIP MEMBERS: Your exclusive 25% discount code is SMS25. Valid this week only. Shop now: example.com/vip. Reply STOP to opt out.',
    status: 'draft',
    createdDate: 'Mar 24, 2024',
    recipients: 2800,
    deliveryRate: 0,
    responseRate: 0,
    thumbnail: null,
    fromNumber: '+1 (555) 123-4567',
    list: 'Premium Members',
    segments: 'All Premium Members',
    characters: 119
  },
  {
    id: 7,
    name: 'Holiday Special',
    message: 'Happy Holidays! Enjoy 40% off all products until Dec 25. Shop now: example.com/holiday. Reply STOP to opt out.',
    status: 'archived',
    createdDate: 'Dec 10, 2023',
    sentDate: 'Dec 15, 2023',
    recipients: 7320,
    deliveryRate: 99.1,
    responseRate: 7.2,
    thumbnail: '/placeholder.svg?height=200&width=400',
    fromNumber: '+1 (555) 123-4567',
    list: 'All Subscribers',
    segments: 'All Segments',
    optOutRate: 0.2,
    cost: 732.00,
    characters: 102
  }
]);
</script>

<style scoped>
/* Add any additional custom styling here */
</style>