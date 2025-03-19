<template>
    <div class="flex h-full">
      <!-- Sidebar for adding/editing ad campaigns -->
      <div 
        class="fixed inset-y-0 right-0 z-20 flex w-full md:w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out"
        :class="showCampaignSidebar ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="flex h-14 items-center justify-between border-b px-4">
          <h2 class="text-lg font-semibold">{{ editingCampaign ? 'Edit Ad Campaign' : 'Create Ad Campaign' }}</h2>
          <button 
            @click="closeCampaignSidebar" 
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
              <h3 class="text-sm font-medium text-muted-foreground">Campaign Information</h3>
              
              <div class="space-y-2">
                <label for="campaignName" class="text-sm font-medium">Campaign Name</label>
                <input 
                  id="campaignName" 
                  v-model="campaign.name" 
                  type="text" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g. Summer Sale 2024"
                  required
                />
              </div>
              
              <div class="space-y-2">
                <label for="campaignObjective" class="text-sm font-medium">Campaign Objective</label>
                <select 
                  id="campaignObjective" 
                  v-model="campaign.objective" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select an objective</option>
                  <option value="AWARENESS">Brand Awareness</option>
                  <option value="CONSIDERATION">Consideration</option>
                  <option value="TRAFFIC">Website Traffic</option>
                  <option value="ENGAGEMENT">Engagement</option>
                  <option value="LEADS">Lead Generation</option>
                  <option value="CONVERSIONS">Conversions</option>
                  <option value="SALES">Sales</option>
                  <option value="APP_INSTALLS">App Installs</option>
                </select>
              </div>
              
              <div class="space-y-2">
                <label for="campaignDescription" class="text-sm font-medium">Description (Optional)</label>
                <textarea 
                  id="campaignDescription" 
                  v-model="campaign.description" 
                  rows="3" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Describe the purpose of this campaign"
                ></textarea>
              </div>
              
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <label for="startDate" class="text-sm font-medium">Start Date</label>
                  <input 
                    id="startDate" 
                    v-model="campaign.startDate" 
                    type="date" 
                    class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  />
                </div>
                <div class="space-y-2">
                  <label for="endDate" class="text-sm font-medium">End Date</label>
                  <input 
                    id="endDate" 
                    v-model="campaign.endDate" 
                    type="date" 
                    class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  />
                </div>
              </div>
              
              <div class="space-y-2">
                <label for="totalBudget" class="text-sm font-medium">Total Budget</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                  <input 
                    id="totalBudget" 
                    v-model="campaign.totalBudget" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    class="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>
            
            <!-- Platform Selection -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-muted-foreground">Platforms</h3>
              
              <div class="space-y-2">
                <label class="text-sm font-medium">Select Platforms</label>
                <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  <div 
                    v-for="platform in availablePlatforms" 
                    :key="platform.id"
                    class="flex items-center gap-2"
                  >
                    <input 
                      type="checkbox" 
                      :id="`platform-${platform.id}`" 
                      :value="platform.id" 
                      v-model="campaign.selectedPlatforms" 
                      class="h-4 w-4 rounded border-input"
                    />
                    <label :for="`platform-${platform.id}`" class="text-sm">{{ platform.name }}</label>
                  </div>
                </div>
              </div>
              
              <!-- Platform-specific settings -->
              <div v-if="campaign.selectedPlatforms.length > 0" class="space-y-4">
                <div 
                  v-for="platformId in campaign.selectedPlatforms" 
                  :key="platformId"
                  class="rounded-md border p-4 space-y-4"
                >
                  <div class="flex items-center gap-2">
                    <component :is="getPlatformIcon(platformId)" class="h-5 w-5" :class="getPlatformColor(platformId)" />
                    <h4 class="text-sm font-medium">{{ getPlatformName(platformId) }} Settings</h4>
                  </div>
                  
                  <!-- Budget allocation -->
                  <div class="space-y-2">
                    <label :for="`budget-${platformId}`" class="text-sm font-medium">Budget Allocation</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                      <input 
                        :id="`budget-${platformId}`" 
                        v-model="platformSettings[platformId].budget" 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        class="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div class="flex items-center justify-between">
                      <p class="text-xs text-muted-foreground">
                        {{ calculateBudgetPercentage(platformId) }}% of total budget
                      </p>
                      <button 
                        type="button" 
                        @click="distributeBudgetEvenly" 
                        class="text-xs text-primary hover:underline"
                      >
                        Distribute evenly
                      </button>
                    </div>
                  </div>
                  
                  <!-- Platform-specific targeting -->
                  <div class="space-y-2">
                    <label :for="`targeting-${platformId}`" class="text-sm font-medium">Audience Targeting</label>
                    <select 
                      :id="`targeting-${platformId}`" 
                      v-model="platformSettings[platformId].targeting" 
                      class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select a saved audience</option>
                      <option value="BROAD">Broad Audience</option>
                      <option value="CUSTOM">Custom Audience</option>
                      <option value="LOOKALIKE">Lookalike Audience</option>
                      <option value="RETARGETING">Retargeting</option>
                    </select>
                  </div>
                  
                  <!-- Ad format -->
                  <div class="space-y-2">
                    <label :for="`format-${platformId}`" class="text-sm font-medium">Ad Format</label>
                    <select 
                      :id="`format-${platformId}`" 
                      v-model="platformSettings[platformId].format" 
                      class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select ad format</option>
                      <option v-for="format in getPlatformFormats(platformId)" :key="format.id" :value="format.id">
                        {{ format.name }}
                      </option>
                    </select>
                  </div>
                  
                  <!-- Platform-specific placement -->
                  <div v-if="platformId === 'facebook' || platformId === 'instagram'" class="space-y-2">
                    <label :for="`placement-${platformId}`" class="text-sm font-medium">Placements</label>
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          :id="`placement-auto-${platformId}`" 
                          v-model="platformSettings[platformId].autoPlacement" 
                          class="h-4 w-4 rounded border-input"
                        />
                        <label :for="`placement-auto-${platformId}`" class="text-sm">Automatic Placements (Recommended)</label>
                      </div>
                      <div v-if="!platformSettings[platformId].autoPlacement" class="pl-6 space-y-1">
                        <div 
                          v-for="placement in getPlatformPlacements(platformId)" 
                          :key="placement.id"
                          class="flex items-center gap-2"
                        >
                          <input 
                            type="checkbox" 
                            :id="`placement-${placement.id}-${platformId}`" 
                            :value="placement.id" 
                            v-model="platformSettings[platformId].selectedPlacements" 
                            class="h-4 w-4 rounded border-input"
                          />
                          <label :for="`placement-${placement.id}-${platformId}`" class="text-sm">{{ placement.name }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Creative assets -->
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <label class="text-sm font-medium">Creative Assets</label>
                      <button 
                        type="button" 
                        @click="openAssetLibrary(platformId)" 
                        class="text-xs text-primary hover:underline"
                      >
                        Browse Asset Library
                      </button>
                    </div>
                    
                    <div 
                      class="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input bg-muted/20 px-4 py-4 text-center"
                      @click="triggerFileInput(platformId)"
                    >
                      <UploadCloudIcon class="mb-2 h-8 w-8 text-muted-foreground" />
                      <div class="mt-2 text-xs text-muted-foreground">
                        <span class="font-medium text-primary">Click to upload</span> or drag and drop
                      </div>
                      <p class="text-xs text-muted-foreground">
                        Images, videos, or carousel assets
                      </p>
                      <input :ref="`fileInput-${platformId}`" type="file" class="hidden" multiple />
                    </div>
                    
                    <!-- Preview of selected assets -->
                    <div v-if="platformSettings[platformId].assets.length > 0" class="grid grid-cols-3 gap-2">
                      <div 
                        v-for="(asset, index) in platformSettings[platformId].assets" 
                        :key="index"
                        class="relative rounded-md border bg-muted h-20 w-full overflow-hidden"
                      >
                        <img :src="asset.url" alt="Asset preview" class="h-full w-full object-cover" />
                        <button 
                          type="button" 
                          @click="removeAsset(platformId, index)" 
                          class="absolute top-1 right-1 rounded-full bg-background/80 p-1 hover:bg-background"
                        >
                          <XIcon class="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="rounded-md border border-dashed p-6 text-center">
                <div class="flex flex-col items-center justify-center">
                  <ShareIcon class="h-10 w-10 text-muted-foreground/50" />
                  <h3 class="mt-2 text-sm font-medium">No platforms selected</h3>
                  <p class="mt-1 text-xs text-muted-foreground">
                    Select at least one platform to configure your ad campaign
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Tracking and Analytics -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-muted-foreground">Tracking & Analytics</h3>
              
              <div class="space-y-2">
                <label for="utmSource" class="text-sm font-medium">UTM Source</label>
                <input 
                  id="utmSource" 
                  v-model="campaign.utmSource" 
                  type="text" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g. facebook, google, linkedin"
                />
              </div>
              
              <div class="space-y-2">
                <label for="utmMedium" class="text-sm font-medium">UTM Medium</label>
                <input 
                  id="utmMedium" 
                  v-model="campaign.utmMedium" 
                  type="text" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g. cpc, social, display"
                />
              </div>
              
              <div class="space-y-2">
                <label for="utmCampaign" class="text-sm font-medium">UTM Campaign</label>
                <input 
                  id="utmCampaign" 
                  v-model="campaign.utmCampaign" 
                  type="text" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g. summer_sale_2024"
                />
              </div>
              
              <div class="space-y-2">
                <label for="conversionTracking" class="text-sm font-medium">Conversion Tracking</label>
                <select 
                  id="conversionTracking" 
                  v-model="campaign.conversionTracking" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select tracking method</option>
                  <option value="PIXEL">Pixel Tracking</option>
                  <option value="CONVERSION_API">Conversion API</option>
                  <option value="GOOGLE_ANALYTICS">Google Analytics</option>
                  <option value="CUSTOM">Custom Integration</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        
        <!-- Form Actions -->
        <div class="border-t p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium">Total Budget: <span class="text-primary">${{ campaign.totalBudget || '0.00' }}</span></p>
              <p class="text-xs text-muted-foreground">
                {{ campaign.selectedPlatforms.length }} platform{{ campaign.selectedPlatforms.length !== 1 ? 's' : '' }} selected
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button 
                type="button" 
                @click="closeCampaignSidebar" 
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
      
      <!-- Overlay when sidebar is open -->
      <div 
        v-if="showCampaignSidebar" 
        class="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm"
        @click="closeCampaignSidebar"
      ></div>
  
      <!-- Main Content -->
      <div class="flex h-full w-full flex-col">
        <!-- Page Header -->
        <header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div class="flex h-14 items-center gap-4 px-4 sm:px-6">
            <h1 class="text-lg font-semibold">Ad Campaigns</h1>
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
              <button 
                @click="openAddCampaignSidebar"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                <PlusIcon class="mr-2 h-4 w-4" />
                Create Campaign
              </button>
            </div>
          </div>
        </header>
  
        <!-- Platform Tabs -->
        <div class="border-b px-4 py-2 sm:px-6">
          <div class="flex items-center gap-2 overflow-x-auto">
            <button
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              :class="{ 'bg-primary text-primary-foreground hover:bg-primary/90': platformFilter === 'all' }"
              @click="platformFilter = 'all'"
            >
              <LayoutGridIcon class="mr-2 h-4 w-4" />
              All Platforms
            </button>
            
            <button
              v-for="platform in availablePlatforms"
              :key="platform.id"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              :class="{ 'bg-primary text-primary-foreground hover:bg-primary/90': platformFilter === platform.id }"
              @click="platformFilter = platform.id"
            >
              <component :is="platform.icon" class="mr-2 h-4 w-4" :class="platform.colorClass" />
              {{ platform.name }}
            </button>
          </div>
        </div>
  
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
                <PauseIcon class="mr-2 h-4 w-4" />
                Pause
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
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div class="inline-flex items-center rounded-md border border-input bg-background px-3 h-9">
                <span class="text-sm text-muted-foreground mr-2">Objective:</span>
                <select v-model="objectiveFilter" class="h-full border-0 bg-transparent text-sm focus:outline-none focus:ring-0">
                  <option value="all">All Objectives</option>
                  <option value="AWARENESS">Brand Awareness</option>
                  <option value="CONSIDERATION">Consideration</option>
                  <option value="TRAFFIC">Website Traffic</option>
                  <option value="ENGAGEMENT">Engagement</option>
                  <option value="LEADS">Lead Generation</option>
                  <option value="CONVERSIONS">Conversions</option>
                  <option value="SALES">Sales</option>
                  <option value="APP_INSTALLS">App Installs</option>
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
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
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
              <th class="w-[180px] px-4 py-3 text-right">
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
                        <component 
                          :is="getPlatformIcon(campaign.platforms[0])" 
                          class="h-5 w-5" 
                          :class="getPlatformColor(campaign.platforms[0])" 
                        />
                      </div>
                      <div>
                        <div class="font-medium">{{ campaign.name }}</div>
                        <div class="text-xs text-muted-foreground">{{ getObjectiveName(campaign.objective) }}</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span
                      class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                      :class="{
                      'border-transparent bg-emerald-500/10 text-emerald-500': campaign.status === 'active',
                      'border-transparent bg-amber-500/10 text-amber-500': campaign.status === 'paused',
                      'border-transparent bg-blue-500/10 text-blue-500': campaign.status === 'completed',
                      'border-transparent bg-slate-500/10 text-slate-500': campaign.status === 'draft',
                    }"
                  >
                    {{ campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1) }}
                  </span>
                </td>
                <td class="px-4 py-3 hidden sm:table-cell">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="platform in campaign.platforms" 
                      :key="platform"
                      class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs"
                      :class="getPlatformBadgeClass(platform)"
                    >
                      <component :is="getPlatformIcon(platform)" class="mr-1 h-3 w-3" />
                      {{ getPlatformShortName(platform) }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  <div class="flex items-center gap-1">
                    <CalendarIcon class="h-3 w-3 text-muted-foreground" />
                    <span>{{ campaign.startDate }}</span>
                  </div>
                  <div class="text-xs text-muted-foreground">to {{ campaign.endDate }}</div>
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  <div class="font-medium">${{ campaign.budget.toFixed(2) }}</div>
                  <div class="text-xs text-muted-foreground">${{ campaign.spent.toFixed(2) }} spent</div>
                </td>
                <td class="px-4 py-3 hidden lg:table-cell">
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-16 rounded-full bg-muted">
                      <div
                          class="h-full rounded-full bg-primary"
                          :style="{ width: `${(campaign.spent / campaign.budget) * 100}%` }"
                          :class="{ 
                            'bg-emerald-500': (campaign.spent / campaign.budget) < 0.7, 
                            'bg-amber-500': (campaign.spent / campaign.budget) >= 0.7 && (campaign.spent / campaign.budget) < 0.9,
                            'bg-red-500': (campaign.spent / campaign.budget) >= 0.9
                          }"
                      ></div>
                    </div>
                    <span>{{ Math.round((campaign.spent / campaign.budget) * 100) }}%</span>
                  </div>
                </td>
                <td class="px-4 py-3 hidden lg:table-cell">
                  <div class="font-medium">{{ campaign.impressions.toLocaleString() }}</div>
                  <div class="text-xs text-muted-foreground">{{ campaign.clicks.toLocaleString() }} clicks</div>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                        @click="editCampaign(campaign)"
                    >
                      Edit
                    </button>
                    <button
                        v-if="campaign.status === 'active'"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                        @click="pauseCampaign(campaign.id)"
                    >
                      <PauseIcon class="mr-2 h-4 w-4" />
                      Pause
                    </button>
                    <button
                        v-if="campaign.status === 'paused'"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                        @click="resumeCampaign(campaign.id)"
                    >
                      <PlayIcon class="mr-2 h-4 w-4" />
                      Resume
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
                          <BarChart3Icon class="h-4 w-4" />
                          <span>View Analytics</span>
                        </button>
                        <button class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
                          <RefreshCwIcon class="h-4 w-4" />
                          <span>Extend Campaign</span>
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
                        <dl class="grid grid-cols-[120px_1fr] gap-1 text-sm">
                          <dt class="text-muted-foreground">Name:</dt>
                          <dd>{{ campaign.name }}</dd>
                          <dt class="text-muted-foreground">Objective:</dt>
                          <dd>{{ getObjectiveName(campaign.objective) }}</dd>
                          <dt class="text-muted-foreground">Status:</dt>
                          <dd>
                            <span
                              class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
                              :class="{
                                'border-transparent bg-emerald-500/10 text-emerald-500': campaign.status === 'active',
                                'border-transparent bg-amber-500/10 text-amber-500': campaign.status === 'paused',
                                'border-transparent bg-blue-500/10 text-blue-500': campaign.status === 'completed',
                                'border-transparent bg-slate-500/10 text-slate-500': campaign.status === 'draft',
                              }"
                            >
                              {{ campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1) }}
                            </span>
                          </dd>
                          <dt class="text-muted-foreground">Duration:</dt>
                          <dd>{{ campaign.startDate }} to {{ campaign.endDate }}</dd>
                          <dt class="text-muted-foreground">Created:</dt>
                          <dd>{{ campaign.createdDate }}</dd>
                          <dt class="text-muted-foreground">Last Updated:</dt>
                          <dd>{{ campaign.updatedDate || '-' }}</dd>
                        </dl>
                      </div>
  
                      <!-- Budget & Performance -->
                      <div>
                        <h4 class="mb-2 text-sm font-medium">Budget & Performance</h4>
                        <dl class="grid grid-cols-[120px_1fr] gap-1 text-sm">
                          <dt class="text-muted-foreground">Total Budget:</dt>
                          <dd>${{ campaign.budget.toFixed(2) }}</dd>
                          <dt class="text-muted-foreground">Spent:</dt>
                          <dd>${{ campaign.spent.toFixed(2) }} ({{ Math.round((campaign.spent / campaign.budget) * 100) }}%)</dd>
                          <dt class="text-muted-foreground">Impressions:</dt>
                          <dd>{{ campaign.impressions.toLocaleString() }}</dd>
                          <dt class="text-muted-foreground">Clicks:</dt>
                          <dd>{{ campaign.clicks.toLocaleString() }}</dd>
                          <dt class="text-muted-foreground">CTR:</dt>
                          <dd>{{ (campaign.clicks / campaign.impressions * 100).toFixed(2) }}%</dd>
                          <dt class="text-muted-foreground">Avg. CPC:</dt>
                          <dd>${{ (campaign.spent / campaign.clicks).toFixed(2) }}</dd>
                        </dl>
                      </div>
  
                      <!-- Platforms -->
                      <div>
                        <h4 class="mb-2 text-sm font-medium">Platforms</h4>
                        <div class="space-y-2">
                          <div 
                            v-for="platform in campaign.platforms" 
                            :key="platform"
                            class="rounded-md border p-2"
                          >
                            <div class="flex items-center gap-2">
                              <component :is="getPlatformIcon(platform)" class="h-4 w-4" :class="getPlatformColor(platform)" />
                              <span class="font-medium">{{ getPlatformName(platform) }}</span>
                            </div>
                            <div class="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <div class="text-muted-foreground">Budget</div>
                                <div>${{ getPlatformBudgetFromCampaign(campaign, platform).toFixed(2) }}</div>
                              </div>
                              <div>
                                <div class="text-muted-foreground">Spent</div>
                                <div>${{ getPlatformSpentFromCampaign(campaign, platform).toFixed(2) }}</div>
                              </div>
                              <div>
                                <div class="text-muted-foreground">Impressions</div>
                                <div>{{ getPlatformImpressionsFromCampaign(campaign, platform).toLocaleString() }}</div>
                              </div>
                              <div>
                                <div class="text-muted-foreground">Clicks</div>
                                <div>{{ getPlatformClicksFromCampaign(campaign, platform).toLocaleString() }}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
  
                    <!-- Action Buttons -->
                    <div class="mt-4 flex items-center gap-2">
                      <button 
                        @click="editCampaign(campaign)"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                      >
                        <PencilIcon class="mr-2 h-4 w-4" />
                        Edit Campaign
                      </button>
                      <button 
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                      >
                        <BarChart3Icon class="mr-2 h-4 w-4" />
                        View Analytics
                      </button>
                      <button 
                        v-if="campaign.status === 'active'"
                        @click="pauseCampaign(campaign.id)"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                      >
                        <PauseIcon class="mr-2 h-4 w-4" />
                        Pause Campaign
                      </button>
                      <button 
                        v-if="campaign.status === 'paused'"
                        @click="resumeCampaign(campaign.id)"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                      >
                        <PlayIcon class="mr-2 h-4 w-4" />
                        Resume Campaign
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
              <ShareIcon class="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 class="mt-4 text-lg font-semibold">No ad campaigns found</h3>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ searchQuery || platformFilter !== 'all' ? 'Try adjusting your search or filters.' : 'Get started by creating your first ad campaign.' }}
            </p>
            <button 
              v-if="!searchQuery && platformFilter === 'all'" 
              @click="openAddCampaignSidebar" 
              class="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <PlusIcon class="mr-2 h-4 w-4" />
              Create Campaign
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
  import { ref, computed, onMounted } from 'vue';
  import {
    BarChart3Icon,
    CalendarIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    CopyIcon,
    DownloadIcon,
    FacebookIcon,
    FilterIcon,
    InstagramIcon,
    LayoutGridIcon,
    LinkedinIcon,
    MoreHorizontalIcon,
    PauseIcon,
    PencilIcon,
    PlayIcon,
    PlusIcon,
    RefreshCwIcon,
    SaveIcon,
    Search,
    ShareIcon,
    SlidersHorizontalIcon,
    TrashIcon,
    TwitterIcon,
    UploadCloudIcon,
    XIcon,
    FileIcon
  } from 'lucide-vue-next';
  
  // Sidebar state
  const showCampaignSidebar = ref(false);
  const editingCampaign = ref<any>(null);
  
  // Campaign form data
  const campaign = ref({
    name: '',
    objective: '',
    description: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    selectedPlatforms: [],
    platformSettings: {},
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    conversionTracking: ''
  });
  
  // Platform settings
  const platformSettings = ref({});
  
  // Available platforms
  const availablePlatforms = [
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: FacebookIcon, 
      colorClass: 'text-blue-600',
      formats: [
        { id: 'image', name: 'Image Ad' },
        { id: 'video', name: 'Video Ad' },
        { id: 'carousel', name: 'Carousel Ad' },
        { id: 'collection', name: 'Collection Ad' },
        { id: 'stories', name: 'Stories Ad' }
      ],
      placements: [
        { id: 'feed', name: 'News Feed' },
        { id: 'right_column', name: 'Right Column' },
        { id: 'marketplace', name: 'Marketplace' },
        { id: 'video_feeds', name: 'Video Feeds' }
      ]
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: InstagramIcon, 
      colorClass: 'text-pink-600',
      formats: [
        { id: 'image', name: 'Image Ad' },
        { id: 'video', name: 'Video Ad' },
        { id: 'carousel', name: 'Carousel Ad' },
        { id: 'stories', name: 'Stories Ad' },
        { id: 'reels', name: 'Reels Ad' }
      ],
      placements: [
        { id: 'feed', name: 'Feed' },
        { id: 'stories', name: 'Stories' },
        { id: 'explore', name: 'Explore' },
        { id: 'reels', name: 'Reels' }
      ]
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: LinkedinIcon, 
      colorClass: 'text-blue-700',
      formats: [
        { id: 'single_image', name: 'Single Image Ad' },
        { id: 'carousel', name: 'Carousel Ad' },
        { id: 'video', name: 'Video Ad' },
        { id: 'text', name: 'Text Ad' },
        { id: 'spotlight', name: 'Spotlight Ad' }
      ],
      placements: [
        { id: 'feed', name: 'Feed' },
        { id: 'sidebar', name: 'Sidebar' },
        { id: 'message', name: 'Message Ads' },
        { id: 'inmail', name: 'InMail' }
      ]
    },
    { 
      id: 'twitter', 
      name: 'Twitter/X', 
      icon: TwitterIcon, 
      colorClass: 'text-sky-500',
      formats: [
        { id: 'promoted_tweet', name: 'Promoted Tweet' },
        { id: 'image', name: 'Image Ad' },
        { id: 'video', name: 'Video Ad' },
        { id: 'carousel', name: 'Carousel Ad' }
      ],
      placements: [
        { id: 'timeline', name: 'Timeline' },
        { id: 'profile', name: 'Profile' },
        { id: 'search', name: 'Search Results' }
      ]
    },
    { 
      id: 'google', 
      name: 'Google Ads', 
      icon: Search, 
      colorClass: 'text-red-500',
      formats: [
        { id: 'search', name: 'Search Ad' },
        { id: 'display', name: 'Display Ad' },
        { id: 'shopping', name: 'Shopping Ad' },
        { id: 'video', name: 'Video Ad' },
        { id: 'app', name: 'App Ad' }
      ],
      placements: [
        { id: 'search', name: 'Search Network' },
        { id: 'display', name: 'Display Network' },
        { id: 'youtube', name: 'YouTube' },
        { id: 'discovery', name: 'Discovery' }
      ]
    }
  ];
  
  // Table state
  const searchQuery = ref('');
  const platformFilter = ref('all');
  const statusFilter = ref('all');
  const objectiveFilter = ref('all');
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
    { key: 'name', label: 'Campaign Name', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'platforms', label: 'Platforms', sortable: false, responsiveHide: 'sm' },
    { key: 'dates', label: 'Dates', sortable: true, responsiveHide: 'md' },
    { key: 'budget', label: 'Budget', sortable: true, responsiveHide: 'md' },
    { key: 'spent', label: 'Spent', sortable: true, responsiveHide: 'lg' },
    { key: 'performance', label: 'Performance', sortable: true, responsiveHide: 'lg' },
  ];
  
  // Visible columns
  const visibleColumns = ref(['name', 'status', 'platforms', 'dates', 'budget', 'spent', 'performance']);
  
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
    objectiveFilter.value = 'all';
    dateFilter.value = 'all';
    platformFilter.value = 'all';
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
  
  // Initialize platform settings
  const initializePlatformSettings = () => {
    availablePlatforms.forEach(platform => {
      if (!platformSettings.value[platform.id]) {
        platformSettings.value[platform.id] = {
          budget: '',
          targeting: '',
          format: '',
          autoPlacement: true,
          selectedPlacements: [],
          assets: []
        };
      }
    });
  };
  
  // Sidebar functions
  const openAddCampaignSidebar = () => {
    // Reset form
    campaign.value = {
      name: '',
      objective: '',
      description: '',
      startDate: '',
      endDate: '',
      totalBudget: '',
      selectedPlatforms: [],
      platformSettings: {},
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      conversionTracking: ''
    };
    
    // Reset platform settings
    platformSettings.value = {};
    initializePlatformSettings();
    
    editingCampaign.value = null;
    showCampaignSidebar.value = true;
  };
  
  const editCampaign = (campaignData: any) => {
    // Populate form with campaign data
    campaign.value = {
      name: campaignData.name,
      objective: campaignData.objective,
      description: campaignData.description || '',
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      totalBudget: campaignData.budget.toString(),
      selectedPlatforms: [...campaignData.platforms],
      platformSettings: { ...campaignData.platformSettings },
      utmSource: campaignData.utmSource || '',
      utmMedium: campaignData.utmMedium || '',
      utmCampaign: campaignData.utmCampaign || '',
      conversionTracking: campaignData.conversionTracking || ''
    };
    
    // Initialize platform settings
    platformSettings.value = {};
    
    // Set platform settings from campaign data
    campaignData.platforms.forEach(platformId => {
      platformSettings.value[platformId] = {
        budget: campaignData.platformData[platformId]?.budget.toString() || '',
        targeting: campaignData.platformSettings?.[platformId]?.targeting || '',
        format: campaignData.platformSettings?.[platformId]?.format || '',
        autoPlacement: campaignData.platformSettings?.[platformId]?.autoPlacement !== false,
        selectedPlacements: campaignData.platformSettings?.[platformId]?.selectedPlacements || [],
        assets: campaignData.platformSettings?.[platformId]?.assets || []
      };
    });
    
    // Initialize any missing platform settings
    initializePlatformSettings();
    
    editingCampaign.value = campaignData;
    showCampaignSidebar.value = true;
  };
  
  const closeCampaignSidebar = () => {
    showCampaignSidebar.value = false;
  };
  
  // Platform-specific functions
  const getPlatformIcon = (platformId: string) => {
    const platform = availablePlatforms.find(p => p.id === platformId);
    return platform ? platform.icon : ShareIcon;
  };
  
  const getPlatformColor = (platformId: string) => {
    const platform = availablePlatforms.find(p => p.id === platformId);
    return platform ? platform.colorClass : '';
  };
  
  const getPlatformName = (platformId: string) => {
    const platform = availablePlatforms.find(p => p.id === platformId);
    return platform ? platform.name : platformId;
  };
  
  const getPlatformShortName = (platformId: string) => {
    const platform = availablePlatforms.find(p => p.id === platformId);
    return platform ? platform.name : platformId;
  };
  
  const getPlatformBadgeClass = (platformId: string) => {
    switch (platformId) {
      case 'facebook':
        return 'border-transparent bg-blue-500/10 text-blue-600';
      case 'instagram':
        return 'border-transparent bg-pink-500/10 text-pink-600';
      case 'linkedin':
        return 'border-transparent bg-blue-700/10 text-blue-700';
      case 'twitter':
        return 'border-transparent bg-sky-500/10 text-sky-500';
      case 'google':
        return 'border-transparent bg-red-500/10 text-red-500';
      default:
        return 'border-transparent bg-gray-500/10 text-gray-500';
    }
  };
  
  const getPlatformFormats = (platformId: string) => {
    const platform = availablePlatforms.find(p => p.id === platformId);
    return platform ? platform.formats : [];
  };
  
  const getPlatformPlacements = (platformId: string) => {
    const platform = availablePlatforms.find(p => p.id === platformId);
    return platform ? platform.placements : [];
  };
  
  // Campaign data helpers
  const calculateBudgetPercentage = (platformId: string) => {
    const totalBudget = parseFloat(campaign.value.totalBudget) || 0;
    const platformBudget = parseFloat(platformSettings.value[platformId]?.budget) || 0;
    
    if (totalBudget === 0) return 0;
    return Math.round((platformBudget / totalBudget) * 100);
  };
  
  const distributeBudgetEvenly = () => {
    const totalBudget = parseFloat(campaign.value.totalBudget) || 0;
    if (totalBudget === 0 || campaign.value.selectedPlatforms.length === 0) return;
    
    const budgetPerPlatform = (totalBudget / campaign.value.selectedPlatforms.length).toFixed(2);
    
    campaign.value.selectedPlatforms.forEach(platformId => {
      if (!platformSettings.value[platformId]) {
        platformSettings.value[platformId] = {
          budget: '',
          targeting: '',
          format: '',
          autoPlacement: true,
          selectedPlacements: [],
          assets: []
        };
      }
      platformSettings.value[platformId].budget = budgetPerPlatform;
    });
  };
  
  // File upload functions
  const triggerFileInput = (platformId: string) => {
    // This would need a ref to work properly
    console.log(`Trigger file input for ${platformId}`);
  };
  
  const openAssetLibrary = (platformId: string) => {
    console.log(`Open asset library for ${platformId}`);
  };
  
  const removeAsset = (platformId: string, index: number) => {
    if (platformSettings.value[platformId]?.assets) {
      platformSettings.value[platformId].assets.splice(index, 1);
    }
  };
  
  // Campaign actions
  const pauseCampaign = (id: number) => {
    const index = campaigns.value.findIndex(c => c.id === id);
    if (index !== -1) {
      campaigns.value[index].status = 'paused';
    }
  };
  
  const resumeCampaign = (id: number) => {
    const index = campaigns.value.findIndex(c => c.id === id);
    if (index !== -1) {
      campaigns.value[index].status = 'active';
    }
  };
  
  // Save campaign
  const saveCampaign = () => {
    // Prepare platform settings for saving
    const preparedPlatformSettings = {};
    campaign.value.selectedPlatforms.forEach(platformId => {
      preparedPlatformSettings[platformId] = platformSettings.value[platformId];
    });
    
    if (editingCampaign.value) {
      // Update existing campaign
      const index = campaigns.value.findIndex(c => c.id === editingCampaign.value.id);
      if (index !== -1) {
        campaigns.value[index] = {
          ...editingCampaign.value,
          name: campaign.value.name,
          objective: campaign.value.objective,
          description: campaign.value.description,
          startDate: campaign.value.startDate,
          endDate: campaign.value.endDate,
          budget: parseFloat(campaign.value.totalBudget) || 0,
          platforms: [...campaign.value.selectedPlatforms],
          platformSettings: preparedPlatformSettings,
          utmSource: campaign.value.utmSource,
          utmMedium: campaign.value.utmMedium,
          utmCampaign: campaign.value.utmCampaign,
          conversionTracking: campaign.value.conversionTracking,
          updatedDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        };
      }
    } else {
      // Add new campaign
      const newCampaign = {
        id: campaigns.value.length + 1,
        name: campaign.value.name,
        objective: campaign.value.objective,
        description: campaign.value.description,
        startDate: campaign.value.startDate,
        endDate: campaign.value.endDate,
        budget: parseFloat(campaign.value.totalBudget) || 0,
        spent: 0,
        impressions: 0,
        clicks: 0,
        platforms: [...campaign.value.selectedPlatforms],
        platformSettings: preparedPlatformSettings,
        utmSource: campaign.value.utmSource,
        utmMedium: campaign.value.utmMedium,
        utmCampaign: campaign.value.utmCampaign,
        conversionTracking: campaign.value.conversionTracking,
        status: 'draft',
        createdDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        updatedDate: null,
        platformData: {}
      };
      
      // Initialize platform data
      campaign.value.selectedPlatforms.forEach(platformId => {
        newCampaign.platformData[platformId] = {
          budget: parseFloat(platformSettings.value[platformId].budget) || 0,
          spent: 0,
          impressions: 0,
          clicks: 0
        };
      });
      
      campaigns.value.unshift(newCampaign);
    }
    
    // Close sidebar
    closeCampaignSidebar();
  };
  
  // Helper functions
  const getObjectiveName = (objective: string) => {
    switch (objective) {
      case 'AWARENESS':
        return 'Brand Awareness';
      case 'CONSIDERATION':
        return 'Consideration';
      case 'TRAFFIC':
        return 'Website Traffic';
      case 'ENGAGEMENT':
        return 'Engagement';
      case 'LEADS':
        return 'Lead Generation';
      case 'CONVERSIONS':
        return 'Conversions';
      case 'SALES':
        return 'Sales';
      case 'APP_INSTALLS':
        return 'App Installs';
      default:
        return objective;
    }
  };
  
  const getPlatformBudgetFromCampaign = (campaignData: any, platformId: string) => {
    return campaignData.platformData[platformId]?.budget || 0;
  };
  
  const getPlatformSpentFromCampaign = (campaignData: any, platformId: string) => {
    return campaignData.platformData[platformId]?.spent || 0;
  };
  
  const getPlatformImpressionsFromCampaign = (campaignData: any, platformId: string) => {
    return campaignData.platformData[platformId]?.impressions || 0;
  };
  
  const getPlatformClicksFromCampaign = (campaignData: any, platformId: string) => {
    return campaignData.platformData[platformId]?.clicks || 0;
  };
  
  // Filtered campaigns based on search and filters
  const filteredCampaigns = computed(() => {
    let result = [...campaigns.value];
  
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(campaign =>
          campaign.name.toLowerCase().includes(query) ||
          (campaign.description && campaign.description.toLowerCase().includes(query))
      );
    }
  
    // Apply platform filter
    if (platformFilter.value !== 'all') {
      result = result.filter(campaign => campaign.platforms.includes(platformFilter.value));
    }
  
    // Apply status filter
    if (statusFilter.value !== 'all') {
      result = result.filter(campaign => campaign.status === statusFilter.value);
    }
  
    // Apply objective filter
    if (objectiveFilter.value !== 'all') {
      result = result.filter(campaign => campaign.objective === objectiveFilter.value);
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
        case 'dates':
          valueA = a.startDate;
          valueB = b.startDate;
          break;
        case 'budget':
          valueA = a.budget;
          valueB = b.budget;
          break;
        case 'spent':
          valueA = a.spent;
          valueB = b.spent;
          break;
        case 'performance':
          valueA = a.clicks / a.impressions || 0;
          valueB = b.clicks / b.impressions || 0;
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
  
  // Initialize platform settings on component mount
  onMounted(() => {
    initializePlatformSettings();
  });
  
  // Sample campaign data
  const campaigns = ref([
    {
      id: 1,
      name: 'Summer Sale 2024',
      objective: 'SALES',
      description: 'Promote summer collection with special discounts',
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      budget: 5000,
      spent: 2750,
      impressions: 450000,
      clicks: 12500,
      platforms: ['facebook', 'instagram'],
      status: 'active',
      createdDate: 'May 15, 2024',
      updatedDate: 'May 20, 2024',
      utmSource: 'social',
      utmMedium: 'cpc',
      utmCampaign: 'summer_sale_2024',
      conversionTracking: 'PIXEL',
      platformData: {
        facebook: {
          budget: 3000,
          spent: 1650,
          impressions: 280000,
          clicks: 7500
        },
        instagram: {
          budget: 2000,
          spent: 1100,
          impressions: 170000,
          clicks: 5000
        }
      }
    },
    {
      id: 2,
      name: 'New Product Launch',
      objective: 'AWARENESS',
      description: 'Introducing our new premium product line',
      startDate: '2024-05-15',
      endDate: '2024-06-15',
      budget: 8000,
      spent: 4200,
      impressions: 720000,
      clicks: 18000,
      platforms: ['facebook', 'instagram', 'google'],
      status: 'active',
      createdDate: 'Apr 30, 2024',
      updatedDate: 'May 10, 2024',
      utmSource: 'multi',
      utmMedium: 'cpc',
      utmCampaign: 'product_launch_2024',
      conversionTracking: 'GOOGLE_ANALYTICS',
      platformData: {
        facebook: {
          budget: 3000,
          spent: 1600,
          impressions: 250000,
          clicks: 6200
        },
        instagram: {
          budget: 2500,
          spent: 1300,
          impressions: 220000,
          clicks: 5500
        },
        google: {
          budget: 2500,
          spent: 1300,
          impressions: 250000,
          clicks: 6300
        }
      }
    },
    {
      id: 3,
      name: 'B2B Lead Generation',
      objective: 'LEADS',
      description: 'Generate high-quality B2B leads for sales team',
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      budget: 12000,
      spent: 8400,
      impressions: 380000,
      clicks: 9500,
      platforms: ['linkedin', 'google'],
      status: 'active',
      createdDate: 'Mar 15, 2024',
      updatedDate: 'Apr 5, 2024',
      utmSource: 'b2b',
      utmMedium: 'cpc',
      utmCampaign: 'lead_gen_q2_2024',
      conversionTracking: 'CONVERSION_API',
      platformData: {
        linkedin: {
          budget: 8000,
          spent: 5600,
          impressions: 220000,
          clicks: 5500
        },
        google: {
          budget: 4000,
          spent: 2800,
          impressions: 160000,
          clicks: 4000
        }
      }
    },
    {
      id: 4,
      name: 'App Install Campaign',
      objective: 'APP_INSTALLS',
      description: 'Drive mobile app installations',
      startDate: '2024-05-01',
      endDate: '2024-05-31',
      budget: 6000,
      spent: 6000,
      impressions: 850000,
      clicks: 42500,
      platforms: ['facebook', 'google'],
      status: 'completed',
      createdDate: 'Apr 15, 2024',
      updatedDate: 'Jun 1, 2024',
      utmSource: 'app',
      utmMedium: 'cpi',
      utmCampaign: 'app_install_may_2024',
      conversionTracking: 'CUSTOM',
      platformData: {
        facebook: {
          budget: 3500,
          spent: 3500,
          impressions: 500000,
          clicks: 25000
        },
        google: {
          budget: 2500,
          spent: 2500,
          impressions: 350000,
          clicks: 17500
        }
      }
    },
    {
      id: 5,
      name: 'Website Traffic Boost',
      objective: 'TRAFFIC',
      description: 'Increase traffic to our new website sections',
      startDate: '2024-06-15',
      endDate: '2024-07-15',
      budget: 4500,
      spent: 0,
      impressions: 0,
      clicks: 0,
      platforms: ['facebook', 'twitter', 'google'],
      status: 'draft',
      createdDate: 'May 25, 2024',
      updatedDate: null,
      utmSource: 'multi',
      utmMedium: 'cpc',
      utmCampaign: 'traffic_boost_summer_2024',
      conversionTracking: 'GOOGLE_ANALYTICS',
      platformData: {
        facebook: {
          budget: 1500,
          spent: 0,
          impressions: 0,
          clicks: 0
        },
        twitter: {
          budget: 1000,
          spent: 0,
          impressions: 0,
          clicks: 0
        },
        google: {
          budget: 2000,
          spent: 0,
          impressions: 0,
          clicks: 0
        }
      }
    },
    {
      id: 6,
      name: 'Brand Awareness Q2',
      objective: 'AWARENESS',
      description: 'Increase brand recognition among target audience',
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      budget: 9000,
      spent: 6300,
      impressions: 1200000,
      clicks: 18000,
      platforms: ['instagram', 'twitter'],
      status: 'paused',
      createdDate: 'Mar 20, 2024',
      updatedDate: 'May 15, 2024',
      utmSource: 'social',
      utmMedium: 'cpm',
      utmCampaign: 'brand_awareness_q2_2024',
      conversionTracking: 'PIXEL',
      platformData: {
        instagram: {
          budget: 5000,
          spent: 3500,
          impressions: 700000,
          clicks: 10500
        },
        twitter: {
          budget: 4000,
          spent: 2800,
          impressions: 500000,
          clicks: 7500
        }
      }
    },
    {
      id: 7,
      name: 'Holiday Season Promotion',
      objective: 'SALES',
      description: 'Promote special holiday offers and discounts',
      startDate: '2024-11-15',
      endDate: '2024-12-31',
      budget: 15000,
      spent: 0,
      impressions: 0,
      clicks: 0,
      platforms: ['facebook', 'instagram', 'google'],
      status: 'draft',
      createdDate: 'May 30, 2024',
      updatedDate: null,
      utmSource: 'holiday',
      utmMedium: 'cpc',
      utmCampaign: 'holiday_season_2024',
      conversionTracking: 'CONVERSION_API',
      platformData: {
        facebook: {
          budget: 5000,
          spent: 0,
          impressions: 0,
          clicks: 0
        },
        instagram: {
          budget: 5000,
          spent: 0,
          impressions: 0,
          clicks: 0
        },
        google: {
          budget: 5000,
          spent: 0,
          impressions: 0,
          clicks: 0
        }
      }
    }
  ]);
  </script>
  
  <style scoped>
  /* Add any additional custom styling here */
  </style>