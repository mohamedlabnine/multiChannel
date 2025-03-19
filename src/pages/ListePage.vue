<template>
    <div class="flex h-full">
      <!-- Sidebar for adding/editing distribution lists -->
      <div 
        class="fixed inset-y-0 right-0 z-20 flex w-full md:w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out"
        :class="showListSidebar ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="flex h-14 items-center justify-between border-b px-4">
          <h2 class="text-lg font-semibold">{{ editingList ? 'Edit Distribution List' : 'Create Distribution List' }}</h2>
          <button 
            @click="closeListSidebar" 
            class="rounded-full p-1 hover:bg-muted"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>
        
        <!-- List Form -->
        <div class="flex-1 overflow-auto p-4">
          <form @submit.prevent="saveList" class="space-y-6 max-w-3xl mx-auto">
            <!-- Basic Information -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-muted-foreground">List Information</h3>
              
              <div class="space-y-2">
                <label for="listCode" class="text-sm font-medium">List Code</label>
                <div class="space-y-1">
                  <input 
                    id="listCode" 
                    v-model="list.code" 
                    type="text" 
                    class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="e.g. CUSTOMERS_2024"
                    pattern="^[A-Z0-9_]+$"
                    required
                    :disabled="editingList"
                  />
                  <p class="text-xs text-muted-foreground">
                    Only uppercase letters, numbers, and underscores. Cannot be changed after creation.
                  </p>
                </div>
              </div>
              
              <div class="space-y-2">
                <label for="listName" class="text-sm font-medium">List Name</label>
                <input 
                  id="listName" 
                  v-model="list.name" 
                  type="text" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g. Active Customers 2024"
                  required
                />
              </div>
              
              <div class="space-y-2">
                <label for="listDescription" class="text-sm font-medium">Description (Optional)</label>
                <textarea 
                  id="listDescription" 
                  v-model="list.description" 
                  rows="3" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Describe the purpose of this distribution list"
                ></textarea>
              </div>
              
              <div class="flex items-start gap-2">
                <div class="mt-1">
                  <input 
                    type="checkbox" 
                    id="listActive" 
                    v-model="list.active" 
                    class="h-4 w-4 rounded border-input"
                  />
                </div>
                <div>
                  <label for="listActive" class="text-sm font-medium">Active</label>
                  <p class="text-xs text-muted-foreground">
                    Only active lists can be used for sending messages
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Tags and Categories -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-muted-foreground">Tags and Categories</h3>
              
              <div class="space-y-2">
                <label class="text-sm font-medium">Tags (Optional)</label>
                <div class="flex flex-wrap gap-2">
                  <div 
                    v-for="(tag, index) in list.tags" 
                    :key="index"
                    class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                  >
                    <span>{{ tag }}</span>
                    <button 
                      type="button" 
                      @click="removeTag(index)" 
                      class="rounded-full hover:bg-primary/20"
                    >
                      <XIcon class="h-3 w-3" />
                    </button>
                  </div>
                  
                  <div class="inline-flex items-center gap-1">
                    <input 
                      type="text" 
                      v-model="newTag" 
                      @keydown.enter.prevent="addTag"
                      class="w-24 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Add tag"
                    />
                    <button 
                      type="button" 
                      @click="addTag" 
                      class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      <PlusIcon class="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="space-y-2">
                <label for="listCategory" class="text-sm font-medium">Category (Optional)</label>
                <select 
                  id="listCategory" 
                  v-model="list.category" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a category</option>
                  <option value="CUSTOMERS">Customers</option>
                  <option value="PROSPECTS">Prospects</option>
                  <option value="SUBSCRIBERS">Subscribers</option>
                  <option value="VIP">VIP</option>
                  <option value="INTERNAL">Internal</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            
            <!-- Contact Management (only for editing) -->
            <div v-if="editingList" class="space-y-4">
              <h3 class="text-sm font-medium text-muted-foreground">Contact Management</h3>
              
              <div class="rounded-md border p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium">Contacts</h4>
                    <p class="text-xs text-muted-foreground">
                      {{ editingList ? editingList.contactCount.toLocaleString() : '0' }} contacts in this list
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      type="button" 
                      @click="showImportModal = true"
                      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                    >
                      <UploadIcon class="mr-2 h-4 w-4" />
                      Import
                    </button>
                    <button 
                      type="button" 
                      @click="downloadContacts"
                      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                    >
                      <DownloadIcon class="mr-2 h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
                
                <div v-if="editingList && editingList.contactCount > 0" class="mt-4">
                  <div class="flex items-center justify-between">
                    <h5 class="text-xs font-medium">Recent Contacts</h5>
                    <button 
                      type="button" 
                      @click="viewAllContacts"
                      class="text-xs text-primary hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div class="mt-2 space-y-2">
                    <div 
                      v-for="(contact, index) in recentContacts" 
                      :key="index"
                      class="flex items-center justify-between rounded-md border p-2 text-sm"
                    >
                      <div class="flex items-center gap-2">
                        <div class="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <UserIcon class="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div>
                          <div>{{ contact.name || 'Unknown' }}</div>
                          <div class="text-xs text-muted-foreground">{{ contact.phone }}</div>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        class="text-xs text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <!-- Form Actions -->
        <div class="border-t p-4">
          <div class="flex items-center justify-end gap-2">
            <button 
              type="button" 
              @click="closeListSidebar" 
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              Cancel
            </button>
            <button 
              type="button"
              @click="saveList" 
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <SaveIcon class="mr-2 h-4 w-4" />
              {{ editingList ? 'Update List' : 'Create List' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Import Contacts Modal -->
      <div 
        v-if="showImportModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div 
          class="fixed inset-0 bg-background/80 backdrop-blur-sm"
          @click="closeImportModal"
        ></div>
        
        <div class="z-50 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Import Contacts</h3>
            <button 
              @click="closeImportModal" 
              class="rounded-full p-1 hover:bg-muted"
            >
              <XIcon class="h-5 w-5" />
            </button>
          </div>
          
          <div class="mt-4 space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Import Method</label>
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <input 
                    type="radio" 
                    id="importFile" 
                    name="importMethod" 
                    value="file" 
                    v-model="importMethod" 
                    class="h-4 w-4"
                  />
                  <label for="importFile" class="text-sm">Upload CSV or Excel file</label>
                </div>
                <div class="flex items-center gap-2">
                  <input 
                    type="radio" 
                    id="importPaste" 
                    name="importMethod" 
                    value="paste" 
                    v-model="importMethod" 
                    class="h-4 w-4"
                  />
                  <label for="importPaste" class="text-sm">Paste data</label>
                </div>
              </div>
            </div>
            
            <div v-if="importMethod === 'file'" class="space-y-2">
              <label class="text-sm font-medium">Upload File</label>
              <div 
                class="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input bg-muted/20 px-4 py-4 text-center"
                @click="triggerFileInput"
              >
                <UploadCloudIcon v-if="!selectedFile" class="mb-2 h-8 w-8 text-muted-foreground" />
                <div v-if="selectedFile" class="flex items-center justify-center text-sm">
                  <FileIcon class="mr-2 h-5 w-5 text-primary" />
                  <span>{{ selectedFile.name }}</span>
                </div>
                <div v-else class="mt-2 text-xs text-muted-foreground">
                  <span class="font-medium text-primary">Click to upload</span> or drag and drop
                </div>
                <p v-if="!selectedFile" class="text-xs text-muted-foreground">
                  CSV, XLSX, or XLS up to 10MB
                </p>
              </div>
              <input 
                ref="fileInput" 
                type="file" 
                class="hidden" 
                accept=".csv,.xlsx,.xls" 
                @change="handleFileSelect" 
              />
            </div>
            
            <div v-if="importMethod === 'paste'" class="space-y-2">
              <label for="pasteData" class="text-sm font-medium">Paste Data</label>
              <textarea 
                id="pasteData" 
                rows="6" 
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Paste data in format: Name, Phone Number, Email (optional)"
              ></textarea>
              <p class="text-xs text-muted-foreground">
                One contact per line. Format: Name, Phone Number, Email (optional)
              </p>
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-medium">Options</label>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="headerRow" 
                    v-model="importOptions.headerRow" 
                    class="h-4 w-4 rounded border-input"
                  />
                  <label for="headerRow" class="text-sm">First row contains headers</label>
                </div>
                <div class="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="skipDuplicates" 
                    v-model="importOptions.skipDuplicates" 
                    class="h-4 w-4 rounded border-input"
                  />
                  <label for="skipDuplicates" class="text-sm">Skip duplicate phone numbers</label>
                </div>
                <div class="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="validateNumbers" 
                    v-model="importOptions.validateNumbers" 
                    class="h-4 w-4 rounded border-input"
                  />
                  <label for="validateNumbers" class="text-sm">Validate phone numbers</label>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-end gap-2 pt-4">
              <button 
                type="button" 
                @click="closeImportModal" 
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                Cancel
              </button>
              <button 
                type="button"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                <UploadIcon class="mr-2 h-4 w-4" />
                Import Contacts
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Overlay when sidebar is open -->
      <div 
        v-if="showListSidebar" 
        class="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm"
        @click="closeListSidebar"
      ></div>
  
      <!-- Main Content -->
      <div class="flex h-full w-full flex-col">
        <!-- Page Header -->
        <header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div class="flex h-14 items-center gap-4 px-4 sm:px-6">
            <h1 class="text-lg font-semibold">Distribution Lists</h1>
            <div class="ml-auto flex items-center gap-2">
              <div class="relative">
                <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                    type="search"
                    v-model="searchQuery"
                    placeholder="Search lists..."
                    class="h-9 w-[180px] rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-[240px]"
                />
              </div>
              <button 
                @click="openAddListSidebar"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                <PlusIcon class="mr-2 h-4 w-4" />
                Create List
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
                <DownloadIcon class="mr-2 h-4 w-4" />
                Export
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
                  <option value="all">All Lists</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div class="inline-flex items-center rounded-md border border-input bg-background px-3 h-9">
                <span class="text-sm text-muted-foreground mr-2">Category:</span>
                <select v-model="categoryFilter" class="h-full border-0 bg-transparent text-sm focus:outline-none focus:ring-0">
                  <option value="all">All Categories</option>
                  <option value="CUSTOMERS">Customers</option>
                  <option value="PROSPECTS">Prospects</option>
                  <option value="SUBSCRIBERS">Subscribers</option>
                  <option value="VIP">VIP</option>
                  <option value="INTERNAL">Internal</option>
                  <option value="OTHER">Other</option>
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
            <template v-for="(list, index) in filteredLists" :key="list.id">
              <!-- Main Row -->
              <tr
                  class="group border-b transition-colors hover:bg-muted/50"
                  :class="{ 'bg-muted/30': selectedRows.includes(list.id) }"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <input
                        type="checkbox"
                        :checked="selectedRows.includes(list.id)"
                        @change="toggleRowSelection(list.id)"
                        class="h-4 w-4 rounded border-input bg-background"
                    />
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <button
                        class="flex h-5 w-5 items-center justify-center rounded-full border border-input bg-background"
                        @click="toggleExpandRow(list.id)"
                    >
                      <ChevronRightIcon
                          class="h-3 w-3 transition-transform"
                          :class="{ 'rotate-90': expandedRows.includes(list.id) }"
                      />
                    </button>
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-10 overflow-hidden rounded bg-muted flex items-center justify-center">
                        <UsersIcon class="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div class="font-medium">{{ list.name }}</div>
                        <div class="text-xs text-muted-foreground">{{ list.code }}</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span
                      class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                      :class="{
                      'border-transparent bg-emerald-500/10 text-emerald-500': list.active,
                      'border-transparent bg-slate-500/10 text-slate-500': !list.active,
                    }"
                  >
                    {{ list.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3 hidden sm:table-cell">
                  <span
                      v-if="list.category"
                      class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                      :class="{
                      'border-transparent bg-blue-500/10 text-blue-500': list.category === 'CUSTOMERS',
                      'border-transparent bg-purple-500/10 text-purple-500': list.category === 'PROSPECTS',
                      'border-transparent bg-green-500/10 text-green-500': list.category === 'SUBSCRIBERS',
                      'border-transparent bg-amber-500/10 text-amber-500': list.category === 'VIP',
                      'border-transparent bg-indigo-500/10 text-indigo-500': list.category === 'INTERNAL',
                      'border-transparent bg-gray-500/10 text-gray-500': list.category === 'OTHER',
                    }"
                  >
                    {{ list.category }}
                  </span>
                  <span v-else class="text-xs text-muted-foreground">-</span>
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  {{ list.contactCount.toLocaleString() }}
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  {{ list.createdDate }}
                </td>
                <td class="px-4 py-3 hidden lg:table-cell">
                  {{ list.updatedDate || '-' }}
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                        @click="editList(list)"
                    >
                      Edit
                    </button>
                    <button
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                        @click="showImportModal = true"
                    >
                      <UploadIcon class="mr-2 h-4 w-4" />
                      Import
                    </button>
                    <div class="relative">
                      <button
                          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
                          @click="toggleActionMenu(list.id)"
                      >
                        <MoreHorizontalIcon class="h-4 w-4" />
                      </button>
  
                      <!-- Action Menu Dropdown -->
                      <div
                          v-if="actionMenuOpen === list.id"
                          class="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border bg-card p-1 shadow-md"
                      >
                        <button class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
                          <CopyIcon class="h-4 w-4" />
                          <span>Duplicate</span>
                        </button>
                        <button class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
                          <DownloadIcon class="h-4 w-4" />
                          <span>Download Contacts</span>
                        </button>
                        <button class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
                          <ToggleLeftIcon v-if="list.active" class="h-4 w-4" />
                          <ToggleRightIcon v-else class="h-4 w-4" />
                          <span>{{ list.active ? 'Deactivate' : 'Activate' }}</span>
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
              <tr v-if="expandedRows.includes(list.id)" class="border-b bg-muted/20">
                <td class="py-3"></td>
                <td colspan="100" class="px-4 py-3">
                  <div class="rounded-md border bg-card p-4">
                    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <!-- List Details -->
                      <div>
                        <h4 class="mb-2 text-sm font-medium">List Details</h4>
                        <dl class="grid grid-cols-[120px_1fr] gap-1 text-sm">
                          <dt class="text-muted-foreground">Name:</dt>
                          <dd>{{ list.name }}</dd>
                          <dt class="text-muted-foreground">Code:</dt>
                          <dd>{{ list.code }}</dd>
                          <dt class="text-muted-foreground">Status:</dt>
                          <dd>
                            <span
                              class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
                              :class="{
                                'border-transparent bg-emerald-500/10 text-emerald-500': list.active,
                                'border-transparent bg-slate-500/10 text-slate-500': !list.active,
                              }"
                            >
                              {{ list.active ? 'Active' : 'Inactive' }}
                            </span>
                          </dd>
                          <dt class="text-muted-foreground">Category:</dt>
                          <dd>{{ list.category || '-' }}</dd>
                          <dt class="text-muted-foreground">Created:</dt>
                          <dd>{{ list.createdDate }}</dd>
                          <dt class="text-muted-foreground">Last Updated:</dt>
                          <dd>{{ list.updatedDate || '-' }}</dd>
                        </dl>
                      </div>
  
                      <!-- List Description -->
                      <div>
                        <h4 class="mb-2 text-sm font-medium">Description</h4>
                        <p class="text-sm text-muted-foreground">
                          {{ list.description || 'No description provided.' }}
                        </p>
                        
                        <h4 class="mb-2 mt-4 text-sm font-medium">Tags</h4>
                        <div class="flex flex-wrap gap-1">
                          <span 
                            v-for="(tag, tagIndex) in list.tags" 
                            :key="tagIndex"
                            class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                          >
                            {{ tag }}
                          </span>
                          <span v-if="list.tags.length === 0" class="text-xs text-muted-foreground">
                            No tags
                          </span>
                        </div>
                      </div>
  
                      <!-- Contact Stats -->
                      <div>
                        <h4 class="mb-2 text-sm font-medium">Contact Statistics</h4>
                        <dl class="grid grid-cols-[120px_1fr] gap-1 text-sm">
                          <dt class="text-muted-foreground">Total Contacts:</dt>
                          <dd>{{ list.contactCount.toLocaleString() }}</dd>
                          <dt class="text-muted-foreground">Valid Numbers:</dt>
                          <dd>{{ Math.round(list.contactCount * 0.98).toLocaleString() }} (98%)</dd>
                          <dt class="text-muted-foreground">WhatsApp Users:</dt>
                          <dd>{{ Math.round(list.contactCount * 0.85).toLocaleString() }} (85%)</dd>
                          <dt class="text-muted-foreground">Last Import:</dt>
                          <dd>{{ list.lastImportDate || 'Never' }}</dd>
                        </dl>
                      </div>
                    </div>
  
                    <!-- Action Buttons -->
                    <div class="mt-4 flex items-center gap-2">
                      <button 
                        @click="editList(list)"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                      >
                        <PencilIcon class="mr-2 h-4 w-4" />
                        Edit List
                      </button>
                      <button 
                        @click="showImportModal = true"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                      >
                        <UploadIcon class="mr-2 h-4 w-4" />
                        Import Contacts
                      </button>
                      <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                        <DownloadIcon class="mr-2 h-4 w-4" />
                        Download Contacts
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
  
          <!-- Empty State -->
          <div v-if="filteredLists.length === 0" class="flex h-[400px] flex-col items-center justify-center p-8 text-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <UsersIcon class="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 class="mt-4 text-lg font-semibold">No distribution lists found</h3>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ searchQuery ? 'Try adjusting your search or filters.' : 'Get started by creating your first distribution list.' }}
            </p>
            <button 
              v-if="!searchQuery" 
              @click="openAddListSidebar" 
              class="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <PlusIcon class="mr-2 h-4 w-4" />
              Create List
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
              Showing <strong>1-{{ Math.min(filteredLists.length, 10) }}</strong> of <strong>{{ filteredLists.length }}</strong> lists
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
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    CopyIcon,
    DownloadIcon,
    FilterIcon,
    MoreHorizontalIcon,
    PencilIcon,
    PlusIcon,
    SaveIcon,
    Search,
    SlidersHorizontalIcon,
    ToggleLeftIcon,
    ToggleRightIcon,
    TrashIcon,
    UploadCloudIcon,
    UploadIcon,
    UserIcon,
    UsersIcon,
    XIcon,
    FileIcon
  } from 'lucide-vue-next';
  
  // Sidebar state
  const showListSidebar = ref(false);
  const editingList = ref<any>(null);
  
  // Import modal state
  const showImportModal = ref(false);
  const importMethod = ref('file');
  const importOptions = ref({
    headerRow: true,
    skipDuplicates: true,
    validateNumbers: true
  });
  const fileInput = ref(null);
  const selectedFile = ref(null);
  
  // File upload methods
  const triggerFileInput = () => {
    fileInput.value.click();
  };
  
  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      selectedFile.value = files[0];
    }
  };
  
  // Add this to reset the file when closing the modal
  const closeImportModal = () => {
    showImportModal.value = false;
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  };
  
  // List form data
  const list = ref({
    code: '',
    name: '',
    description: '',
    active: true,
    category: '',
    tags: []
  });
  
  // New tag input
  const newTag = ref('');
  
  // Table state
  const searchQuery = ref('');
  const statusFilter = ref('all');
  const categoryFilter = ref('all');
  const sortColumn = ref('name');
  const sortDirection = ref('asc');
  const currentPage = ref(1);
  const pageSize = ref(10);
  const selectedRows = ref<number[]>([]);
  const expandedRows = ref<number[]>([]);
  const actionMenuOpen = ref<number | null>(null);
  const showColumnSettings = ref(false);
  
  // Recent contacts for editing view
  const recentContacts = ref([
    { name: 'John Smith', phone: '+15551234567' },
    { name: 'Jane Doe', phone: '+15559876543' },
    { name: 'Michael Johnson', phone: '+15552223333' },
    { name: 'Emily Williams', phone: '+15554445555' },
    { name: 'David Brown', phone: '+15556667777' }
  ]);
  
  // Column definitions
  const allColumns = [
    { key: 'name', label: 'List Name', sortable: true },
    { key: 'active', label: 'Status', sortable: true },
    { key: 'category', label: 'Category', sortable: true, responsiveHide: 'sm' },
    { key: 'contactCount', label: 'Contacts', sortable: true, responsiveHide: 'md' },
    { key: 'createdDate', label: 'Created', sortable: true, responsiveHide: 'md' },
    { key: 'updatedDate', label: 'Updated', sortable: true, responsiveHide: 'lg' },
  ];
  
  // Visible columns
  const visibleColumns = ref(['name', 'active', 'category', 'contactCount', 'createdDate', 'updatedDate']);
  
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
    categoryFilter.value = 'all';
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
    if (selectedRows.value.length === filteredLists.value.length) {
      selectedRows.value = [];
    } else {
      selectedRows.value = filteredLists.value.map(list => list.id);
    }
  };
  
  // Check if all rows are selected
  const isAllSelected = computed(() => {
    return filteredLists.value.length > 0 && selectedRows.value.length === filteredLists.value.length;
  });
  
  // Check if some rows are selected
  const isIndeterminate = computed(() => {
    return selectedRows.value.length > 0 && selectedRows.value.length < filteredLists.value.length;
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
  
  // Sort lists
  const sortBy = (column: string) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      sortDirection.value = 'asc';
    }
  };
  
  // Sidebar functions
  const openAddListSidebar = () => {
    // Reset form
    list.value = {
      code: '',
      name: '',
      description: '',
      active: true,
      category: '',
      tags: []
    };
    editingList.value = null;
    showListSidebar.value = true;
  };
  
  const editList = (listData: any) => {
    // Populate form with list data
    list.value = {
      code: listData.code,
      name: listData.name,
      description: listData.description || '',
      active: listData.active,
      category: listData.category || '',
      tags: [...listData.tags]
    };
    
    editingList.value = listData;
    showListSidebar.value = true;
  };
  
  const closeListSidebar = () => {
    showListSidebar.value = false;
  };
  
  // Tag functions
  const addTag = () => {
    if (newTag.value.trim()) {
      list.value.tags.push(newTag.value.trim());
      newTag.value = '';
    }
  };
  
  const removeTag = (index: number) => {
    list.value.tags.splice(index, 1);
  };
  
  // Contact functions
  const viewAllContacts = () => {
    // Navigate to contacts view for this list
    console.log('View all contacts for list:', editingList.value.id);
  };
  
  const downloadContacts = () => {
    // Download contacts as CSV
    console.log('Download contacts for list:', editingList.value.id);
  };
  
  // Save list
  const saveList = () => {
    if (editingList.value) {
      // Update existing list
      const index = lists.value.findIndex(l => l.id === editingList.value.id);
      if (index !== -1) {
        lists.value[index] = {
          ...editingList.value,
          name: list.value.name,
          description: list.value.description,
          active: list.value.active,
          category: list.value.category,
          tags: [...list.value.tags],
          updatedDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        };
      }
    } else {
      // Add new list
      const newList = {
        id: lists.value.length + 1,
        code: list.value.code,
        name: list.value.name,
        description: list.value.description,
        active: list.value.active,
        category: list.value.category,
        tags: [...list.value.tags],
        contactCount: 0,
        createdDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        updatedDate: null,
        lastImportDate: null
      };
      
      lists.value.unshift(newList);
    }
    
    // Close sidebar
    closeListSidebar.value = false;
  };
  
  // Filtered lists based on search and filters
  const filteredLists = computed(() => {
    let result = [...lists.value];
  
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(list =>
          list.name.toLowerCase().includes(query) ||
          list.code.toLowerCase().includes(query) ||
          (list.description && list.description.toLowerCase().includes(query))
      );
    }
  
    // Apply status filter
    if (statusFilter.value !== 'all') {
      const isActive = statusFilter.value === 'active';
      result = result.filter(list => list.active === isActive);
    }
  
    // Apply category filter
    if (categoryFilter.value !== 'all') {
      result = result.filter(list => list.category === categoryFilter.value);
    }
  
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
  
      switch (sortColumn.value) {
        case 'name':
          valueA = a.name;
          valueB = b.name;
          break;
        case 'active':
          valueA = a.active;
          valueB = b.active;
          break;
        case 'category':
          valueA = a.category || '';
          valueB = b.category || '';
          break;
        case 'contactCount':
          valueA = a.contactCount;
          valueB = b.contactCount;
          break;
        case 'createdDate':
          valueA = a.createdDate;
          valueB = b.createdDate;
          break;
        case 'updatedDate':
          valueA = a.updatedDate || '';
          valueB = b.updatedDate || '';
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
  const totalPages = computed(() => Math.ceil(filteredLists.value.length / pageSize.value));
  
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
  
  // Sample list data
  const lists = ref([
    {
      id: 1,
      code: 'ACTIVE_CUSTOMERS',
      name: 'Active Customers',
      description: 'All customers who have made a purchase in the last 90 days',
      active: true,
      category: 'CUSTOMERS',
      tags: ['high-value', 'engaged'],
      contactCount: 12450,
      createdDate: 'Jan 15, 2024',
      updatedDate: 'Mar 10, 2024',
      lastImportDate: 'Mar 10, 2024'
    },
    {
      id: 2,
      code: 'NEW_SUBSCRIBERS',
      name: 'New Subscribers',
      description: 'Customers who subscribed in the last 30 days',
      active: true,
      category: 'SUBSCRIBERS',
      tags: ['new-users', 'onboarding'],
      contactCount: 3250,
      createdDate: 'Feb 5, 2024',
      updatedDate: 'Mar 15, 2024',
      lastImportDate: 'Mar 15, 2024'
    },
    {
      id: 3,
      code: 'VIP_MEMBERS',
      name: 'VIP Members',
      description: 'Premium customers with high lifetime value',
      active: true,
      category: 'VIP',
      tags: ['premium', 'high-value'],
      contactCount: 1275,
      createdDate: 'Dec 10, 2023',
      updatedDate: 'Mar 5, 2024',
      lastImportDate: 'Mar 5, 2024'
    },
    {
      id: 4,
      code: 'INACTIVE_USERS',
      name: 'Inactive Users',
      description: 'Customers who have not engaged in the last 180 days',
      active: false,
      category: 'CUSTOMERS',
      tags: ['re-engagement', 'dormant'],
      contactCount: 8320,
      createdDate: 'Jan 20, 2024',
      updatedDate: null,
      lastImportDate: 'Jan 20, 2024'
    },
    {
      id: 5,
      code: 'SALES_PROSPECTS',
      name: 'Sales Prospects',
      description: 'Potential customers who have shown interest',
      active: true,
      category: 'PROSPECTS',
      tags: ['leads', 'nurturing'],
      contactCount: 4745,
      createdDate: 'Feb 15, 2024',
      updatedDate: 'Mar 1, 2024',
      lastImportDate: 'Mar 1, 2024'
    },
    {
      id: 6,
      code: 'EVENT_ATTENDEES',
      name: 'Event Attendees',
      description: 'Contacts who registered for our recent webinar',
      active: true,
      category: 'PROSPECTS',
      tags: ['events', 'webinar'],
      contactCount: 2800,
      createdDate: 'Mar 1, 2024',
      updatedDate: 'Mar 12, 2024',
      lastImportDate: 'Mar 12, 2024'
    },
    {
      id: 7,
      code: 'INTERNAL_TEAM',
      name: 'Internal Team',
      description: 'Company employees for internal communications',
      active: true,
      category: 'INTERNAL',
      tags: ['staff', 'internal'],
      contactCount: 85,
      createdDate: 'Dec 5, 2023',
      updatedDate: 'Feb 10, 2024',
      lastImportDate: 'Feb 10, 2024'
    }
  ]);
  </script>
  
  <style scoped>
  /* Add any additional custom styling here */
  </style>