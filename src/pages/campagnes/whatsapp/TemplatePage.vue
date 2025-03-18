<template>
    <div class="flex h-full">
      <!-- Sidebar for adding/editing WhatsApp templates -->
      <div 
        class="fixed inset-y-0 right-0 z-20 flex w-full md:w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out"
        :class="showTemplateSidebar ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="flex h-14 items-center justify-between border-b px-4">
          <h2 class="text-lg font-semibold">{{ editingTemplate ? 'Edit Template' : 'Create New Template' }}</h2>
          <button 
            @click="closeTemplateSidebar" 
            class="rounded-full p-1 hover:bg-muted"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>
        
        <!-- Template Form -->
        <div class="flex-1 overflow-auto p-4">
          <form @submit.prevent="saveTemplate" class="space-y-6 max-w-3xl mx-auto">
            <!-- Basic Information -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-muted-foreground">Template Information</h3>
              
              <div class="space-y-2">
                <label for="templateName" class="text-sm font-medium">Template Name</label>
                <div class="space-y-1">
                  <input 
                    id="templateName" 
                    v-model="template.name" 
                    type="text" 
                    class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="e.g. order_confirmation"
                    pattern="^[a-z0-9_]+$"
                    required
                  />
                  <p class="text-xs text-muted-foreground">
                    Only lowercase letters, numbers, and underscores. No spaces.
                  </p>
                </div>
              </div>
              
              <div class="space-y-2">
                <label for="templateCategory" class="text-sm font-medium">Category</label>
                <select 
                  id="templateCategory" 
                  v-model="template.category" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="UTILITY">Utility</option>
                  <option value="AUTHENTICATION">Authentication</option>
                </select>
                <p class="text-xs text-muted-foreground">
                  <span v-if="template.category === 'MARKETING'">
                    For promotional content, offers, and announcements. May have lower delivery rates.
                  </span>
                  <span v-else-if="template.category === 'UTILITY'">
                    For transactional, account updates, and customer service messages.
                  </span>
                  <span v-else-if="template.category === 'AUTHENTICATION'">
                    For one-time passwords, verification codes, and authentication.
                  </span>
                  <span v-else>
                    Select the category that best describes your template's purpose.
                  </span>
                </p>
              </div>
              
              <div class="space-y-2">
                <label for="templateLanguage" class="text-sm font-medium">Language</label>
                <select 
                  id="templateLanguage" 
                  v-model="template.language" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select a language</option>
                  <option value="en_US">English (US)</option>
                  <option value="en_GB">English (UK)</option>
                  <option value="es_ES">Spanish (Spain)</option>
                  <option value="es_MX">Spanish (Mexico)</option>
                  <option value="pt_BR">Portuguese (Brazil)</option>
                  <option value="fr_FR">French</option>
                  <option value="de_DE">German</option>
                  <option value="it_IT">Italian</option>
                  <option value="ar_SA">Arabic</option>
                  <option value="hi_IN">Hindi</option>
                  <option value="zh_CN">Chinese (Simplified)</option>
                  <option value="ja_JP">Japanese</option>
                  <option value="ko_KR">Korean</option>
                </select>
              </div>
            </div>
            
            <!-- Template Components -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-muted-foreground">Template Components</h3>
              
              <!-- Header Component -->
              <div class="rounded-md border p-4 space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium">Header (Optional)</h4>
                  <button 
                    type="button" 
                    @click="template.header.format = template.header.format ? '' : 'TEXT'"
                    class="text-xs text-primary hover:underline"
                  >
                    {{ template.header.format ? 'Remove Header' : 'Add Header' }}
                  </button>
                </div>
                
                <div v-if="template.header.format" class="space-y-4">
                  <div class="space-y-2">
                    <label for="headerFormat" class="text-sm font-medium">Format</label>
                    <select 
                      id="headerFormat" 
                      v-model="template.header.format" 
                      class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="TEXT">Text</option>
                      <option value="IMAGE">Image</option>
                      <option value="VIDEO">Video</option>
                      <option value="DOCUMENT">Document</option>
                    </select>
                  </div>
                  
                  <div v-if="template.header.format === 'TEXT'" class="space-y-2">
                    <label for="headerText" class="text-sm font-medium">Header Text</label>
                    <input 
                      id="headerText" 
                      v-model="template.header.text" 
                      type="text" 
                      class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Enter header text"
                      maxlength="60"
                    />
                    <p class="text-xs text-muted-foreground">
                      {{ template.header.text.length }}/60 characters
                    </p>
                  </div>
                  
                  <div v-else-if="template.header.format !== 'TEXT'" class="space-y-2">
                    <label class="text-sm font-medium">
                      {{ template.header.format === 'IMAGE' ? 'Image' : 
                         template.header.format === 'VIDEO' ? 'Video' : 'Document' }} Example
                    </label>
                    <div class="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input bg-muted/20 px-4 py-4 text-center">
                      <ImageIcon v-if="template.header.format === 'IMAGE'" class="mb-2 h-8 w-8 text-muted-foreground" />
                      <VideoIcon v-else-if="template.header.format === 'VIDEO'" class="mb-2 h-8 w-8 text-muted-foreground" />
                      <FileIcon v-else class="mb-2 h-8 w-8 text-muted-foreground" />
                      <div class="mt-2 text-xs text-muted-foreground">
                        <span class="font-medium text-primary">Upload an example</span> for review
                      </div>
                      <p class="text-xs text-muted-foreground">
                        {{ template.header.format === 'IMAGE' ? 'JPG or PNG up to 5MB' : 
                           template.header.format === 'VIDEO' ? 'MP4 up to 16MB' : 'PDF up to 100MB' }}
                      </p>
                    </div>
                  </div>
                  
                  <div v-if="template.header.format !== 'TEXT'" class="space-y-2">
                    <label for="headerExample" class="text-sm font-medium">Example URL</label>
                    <input 
                      id="headerExample" 
                      v-model="template.header.example" 
                      type="url" 
                      class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="https://example.com/media.jpg"
                    />
                    <p class="text-xs text-muted-foreground">
                      Provide a publicly accessible URL for review purposes
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Body Component (Required) -->
              <div class="rounded-md border p-4 space-y-4">
                <h4 class="text-sm font-medium">Body (Required)</h4>
                
                <div class="space-y-2">
                  <label for="bodyText" class="text-sm font-medium">Body Text</label>
                  <textarea 
                    id="bodyText" 
                    v-model="template.body.text" 
                    rows="5" 
                    class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Enter your message text here. Use {{1}}, {{2}}, etc. for variables."
                    maxlength="1024"
                    required
                  ></textarea>
                  <p class="text-xs text-muted-foreground">
                    {{ template.body.text.length }}/1024 characters. Use {{number}} for variables.
                  </p>
                </div>
                
                <!-- Variables -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <label class="text-sm font-medium">Variables</label>
                    <button 
                      type="button" 
                      @click="addBodyVariable"
                      class="text-xs text-primary hover:underline"
                    >
                      Add Variable
                    </button>
                  </div>
                  
                  <div v-if="template.body.variables.length === 0" class="text-xs text-muted-foreground italic">
                    No variables defined. Add variables if your body text contains {{number}} placeholders.
                  </div>
                  
                  <div v-for="(variable, index) in template.body.variables" :key="index" class="rounded-md border p-3 space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium">Variable {{index + 1}}</span>
                      <button 
                        type="button" 
                        @click="removeBodyVariable(index)"
                        class="text-xs text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div class="space-y-2">
                      <label :for="`variable-${index}-example`" class="text-xs text-muted-foreground">Example Value</label>
                      <input 
                        :id="`variable-${index}-example`" 
                        v-model="variable.example" 
                        type="text" 
                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Example value for review"
                        required
                      />
                    </div>
                    
                    <div class="space-y-2">
                      <label :for="`variable-${index}-description`" class="text-xs text-muted-foreground">Description (Optional)</label>
                      <input 
                        :id="`variable-${index}-description`" 
                        v-model="variable.description" 
                        type="text" 
                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="What this variable represents"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Footer Component -->
              <div class="rounded-md border p-4 space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium">Footer (Optional)</h4>
                  <button 
                    type="button" 
                    @click="template.footer.text = template.footer.text ? '' : ' '"
                    class="text-xs text-primary hover:underline"
                  >
                    {{ template.footer.text ? 'Remove Footer' : 'Add Footer' }}
                  </button>
                </div>
                
                <div v-if="template.footer.text !== null" class="space-y-2">
                  <label for="footerText" class="text-sm font-medium">Footer Text</label>
                  <input 
                    id="footerText" 
                    v-model="template.footer.text" 
                    type="text" 
                    class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Enter footer text"
                    maxlength="60"
                  />
                  <p class="text-xs text-muted-foreground">
                    {{ template.footer.text.length }}/60 characters
                  </p>
                </div>
              </div>
              
              <!-- Buttons Component -->
              <div class="rounded-md border p-4 space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-medium">Buttons (Optional)</h4>
                  <div class="flex items-center gap-2">
                    <select 
                      v-model="buttonTypeToAdd" 
                      class="h-8 rounded-md border border-input bg-background px-2 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      :disabled="template.buttons.length >= 3 || !canAddMoreButtons"
                    >
                      <option value="QUICK_REPLY">Quick Reply</option>
                      <option value="URL">URL</option>
                      <option value="PHONE_NUMBER">Phone Number</option>
                      <option value="COPY_CODE">Copy Code</option>
                    </select>
                    <button 
                      type="button" 
                      @click="addButton"
                      class="text-xs text-primary hover:underline"
                      :disabled="template.buttons.length >= 3 || !canAddMoreButtons"
                    >
                      Add Button
                    </button>
                  </div>
                </div>
                
                <div v-if="template.buttons.length === 0" class="text-xs text-muted-foreground italic">
                  No buttons added. You can add up to 3 buttons.
                </div>
                
                <div v-for="(button, index) in template.buttons" :key="index" class="rounded-md border p-3 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">{{ getButtonTypeLabel(button.type) }} Button</span>
                    <button 
                      type="button" 
                      @click="removeButton(index)"
                      class="text-xs text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div class="space-y-2">
                    <label :for="`button-${index}-text`" class="text-xs text-muted-foreground">Button Text</label>
                    <input 
                      :id="`button-${index}-text`" 
                      v-model="button.text" 
                      type="text" 
                      class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Button text"
                      maxlength="25"
                      required
                    />
                    <p class="text-xs text-muted-foreground">
                      {{ button.text.length }}/25 characters
                    </p>
                  </div>
                  
                  <div v-if="button.type === 'URL'" class="space-y-2">
                    <label :for="`button-${index}-url`" class="text-xs text-muted-foreground">URL</label>
                    <input 
                      :id="`button-${index}-url`" 
                      v-model="button.url" 
                      type="url" 
                      class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                  
                  <div v-if="button.type === 'PHONE_NUMBER'" class="space-y-2">
                    <label :for="`button-${index}-phone`" class="text-xs text-muted-foreground">Phone Number</label>
                    <input 
                      :id="`button-${index}-phone`" 
                      v-model="button.phoneNumber" 
                      type="tel" 
                      class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="+1234567890"
                      required
                    />
                  </div>
                  
                  <div v-if="button.type === 'COPY_CODE'" class="space-y-2">
                    <label :for="`button-${index}-code`" class="text-xs text-muted-foreground">Code to Copy</label>
                    <input 
                      :id="`button-${index}-code`" 
                      v-model="button.code" 
                      type="text" 
                      class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="CODE123"
                      required
                    />
                  </div>
                </div>
                
                <div v-if="template.buttons.length > 0" class="text-xs text-muted-foreground">
                  {{ template.buttons.length }}/3 buttons added
                </div>
              </div>
            </div>
            
            <!-- Preview -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-muted-foreground">Template Preview</h3>
              
              <div class="rounded-md border p-4 bg-muted/20">
                <div class="flex flex-col gap-2 max-w-xs mx-auto">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <MessageSquareIcon class="h-4 w-4 text-green-500" />
                    </div>
                    <div class="text-sm font-medium">WhatsApp Business</div>
                  </div>
                  
                  <div class="rounded-lg bg-green-500/10 text-primary-foreground p-3 text-sm self-start max-w-[80%]">
                    <!-- Header -->
                    <div v-if="template.header.format === 'TEXT' && template.header.text" class="font-semibold mb-2">
                      {{ template.header.text }}
                    </div>
                    <div v-else-if="template.header.format && template.header.format !== 'TEXT'" class="mb-2">
                      <div class="h-32 w-full bg-muted rounded-md flex items-center justify-center">
                        <ImageIcon v-if="template.header.format === 'IMAGE'" class="h-8 w-8 text-muted-foreground" />
                        <VideoIcon v-else-if="template.header.format === 'VIDEO'" class="h-8 w-8 text-muted-foreground" />
                        <FileIcon v-else class="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <!-- Body -->
                    <div class="whitespace-pre-wrap">{{ getFormattedBodyPreview() }}</div>
                    
                    <!-- Footer -->
                    <div v-if="template.footer.text" class="mt-2 text-xs text-muted-foreground">
                      {{ template.footer.text }}
                    </div>
                    
                    <!-- Buttons -->
                    <div v-if="template.buttons.length > 0" class="mt-3 border-t border-green-500/20 pt-2 space-y-2">
                      <div v-for="(button, index) in template.buttons" :key="index" class="flex items-center justify-center">
                        <button class="w-full text-center py-1 px-2 rounded-md bg-green-500/10 text-green-600 text-xs font-medium">
                          {{ button.text }}
                        </button>
                      </div>
                    </div>
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
              <p class="text-sm text-muted-foreground">
                Templates require approval before use. Review may take 1-2 business days.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button 
                type="button" 
                @click="closeTemplateSidebar" 
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                Cancel
              </button>
              <button 
                type="button"
                @click="saveTemplate" 
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                <SaveIcon class="mr-2 h-4 w-4" />
                {{ editingTemplate ? 'Update Template' : 'Submit for Approval' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Overlay when sidebar is open -->
      <div 
        v-if="showTemplateSidebar" 
        class="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm"
        @click="closeTemplateSidebar"
      ></div>
  
      <!-- Main Content -->
      <div class="flex h-full w-full flex-col">
        <!-- Page Header -->
        <header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div class="flex h-14 items-center gap-4 px-4 sm:px-6">
            <h1 class="text-lg font-semibold">WhatsApp Templates</h1>
            <div class="ml-auto flex items-center gap-2">
              <div class="relative">
                <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                    type="search"
                    v-model="searchQuery"
                    placeholder="Search templates..."
                    class="h-9 w-[180px] rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-[240px]"
                />
              </div>
              <button 
                @click="openAddTemplateSidebar"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                <PlusIcon class="mr-2 h-4 w-4" />
                Create Template
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
                  <option value="all">All Templates</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div class="inline-flex items-center rounded-md border border-input bg-background px-3 h-9">
                <span class="text-sm text-muted-foreground mr-2">Category:</span>
                <select v-model="categoryFilter" class="h-full border-0 bg-transparent text-sm focus:outline-none focus:ring-0">
                  <option value="all">All Categories</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="UTILITY">Utility</option>
                  <option value="AUTHENTICATION">Authentication</option>
                </select>
              </div>
              <div class="inline-flex items-center rounded-md border border-input bg-background px-3 h-9">
                <span class="text-sm text-muted-foreground mr-2">Language:</span>
                <select v-model="languageFilter" class="h-full border-0 bg-transparent text-sm focus:outline-none focus:ring-0">
                  <option value="all">All Languages</option>
                  <option value="en_US">English (US)</option>
                  <option value="es_ES">Spanish</option>
                  <option value="pt_BR">Portuguese</option>
                  <option value="fr_FR">French</option>
                  <option value="de_DE">German</option>
                </select>
              </div>
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
            <template v-for="(template, index) in filteredTemplates" :key="template.id">
              <!-- Main Row -->
              <tr
                  class="group border-b transition-colors hover:bg-muted/50"
                  :class="{ 'bg-muted/30': selectedRows.includes(template.id) }"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <input
                        type="checkbox"
                        :checked="selectedRows.includes(template.id)"
                        @change="toggleRowSelection(template.id)"
                        class="h-4 w-4 rounded border-input bg-background"
                    />
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <button
                        class="flex h-5 w-5 items-center justify-center rounded-full border border-input bg-background"
                        @click="toggleExpandRow(template.id)"
                    >
                      <ChevronRightIcon
                          class="h-3 w-3 transition-transform"
                          :class="{ 'rotate-90': expandedRows.includes(template.id) }"
                      />
                    </button>
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-10 overflow-hidden rounded bg-muted flex items-center justify-center">
                        <MessageSquareIcon class="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <div class="font-medium">{{ template.name }}</div>
                        <div class="text-xs text-muted-foreground truncate max-w-[200px]">{{ template.body.text }}</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                    <span
                        class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                        :class="{
                        'border-transparent bg-emerald-500/10 text-emerald-500': template.status === 'APPROVED',
                        'border-transparent bg-amber-500/10 text-amber-500': template.status === 'PENDING',
                        'border-transparent bg-red-500/10 text-red-500': template.status === 'REJECTED',
                      }"
                    >
                      {{ template.status }}
                    </span>
                </td>
                <td class="px-4 py-3">
                    <span
                        class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                        :class="{
                        'border-transparent bg-purple-500/10 text-purple-500': template.category === 'MARKETING',
                        'border-transparent bg-blue-500/10 text-blue-500': template.category === 'UTILITY',
                        'border-transparent bg-green-500/10 text-green-500': template.category === 'AUTHENTICATION',
                      }"
                    >
                      {{ template.category }}
                    </span>
                </td>
                <td class="px-4 py-3 hidden sm:table-cell">
                  {{ template.language }}
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  {{ template.createdDate }}
                </td>
                <td class="px-4 py-3 hidden md:table-cell">
                  {{ template.updatedDate || '-' }}
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                        @click="editTemplate(template)"
                        :disabled="template.status === 'APPROVED'"
                    >
                      Edit
                    </button>
                    <div class="relative">
                      <button
                          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
                          @click="toggleActionMenu(template.id)"
                      >
                        <MoreHorizontalIcon class="h-4 w-4" />
                      </button>
  
                      <!-- Action Menu Dropdown -->
                      <div
                          v-if="actionMenuOpen === template.id"
                          class="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border bg-card p-1 shadow-md"
                      >
                        <button class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
                          <CopyIcon class="h-4 w-4" />
                          <span>Duplicate</span>
                        </button>
                        <button 
                          class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                          :disabled="template.status !== 'REJECTED'"
                        >
                          <RefreshCwIcon class="h-4 w-4" />
                          <span>Resubmit</span>
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
              <tr v-if="expandedRows.includes(template.id)" class="border-b bg-muted/20">
                <td class="py-3"></td>
                <td colspan="100" class="px-4 py-3">
                  <div class="rounded-md border bg-card p-4">
                    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <!-- Template Details -->
                      <div>
                        <h4 class="mb-2 text-sm font-medium">Template Details</h4>
                        <dl class="grid grid-cols-[120px_1fr] gap-1 text-sm">
                          <dt class="text-muted-foreground">Name:</dt>
                          <dd>{{ template.name }}</dd>
                          <dt class="text-muted-foreground">Category:</dt>
                          <dd>{{ template.category }}</dd>
                          <dt class="text-muted-foreground">Language:</dt>
                          <dd>{{ template.language }}</dd>
                          <dt class="text-muted-foreground">Status:</dt>
                          <dd>
                            <span
                              class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
                              :class="{
                                'border-transparent bg-emerald-500/10 text-emerald-500': template.status === 'APPROVED',
                                'border-transparent bg-amber-500/10 text-amber-500': template.status === 'PENDING',
                                'border-transparent bg-red-500/10 text-red-500': template.status === 'REJECTED',
                              }"
                            >
                              {{ template.status }}
                            </span>
                          </dd>
                          <dt class="text-muted-foreground">Created:</dt>
                          <dd>{{ template.createdDate }}</dd>
                          <dt class="text-muted-foreground">Last Updated:</dt>
                          <dd>{{ template.updatedDate || '-' }}</dd>
                        </dl>
                      </div>
  
                      <!-- Template Content -->
                      <div>
                        <h4 class="mb-2 text-sm font-medium">Template Content</h4>
                        <dl class="grid grid-cols-[120px_1fr] gap-1 text-sm">
                          <dt class="text-muted-foreground">Header:</dt>
                          <dd>{{ template.header.text || (template.header.format ? template.header.format : 'None') }}</dd>
                          <dt class="text-muted-foreground">Body:</dt>
                          <dd class="whitespace-pre-wrap">{{ template.body.text }}</dd>
                          <dt class="text-muted-foreground">Footer:</dt>
                          <dd>{{ template.footer.text || 'None' }}</dd>
                          <dt class="text-muted-foreground">Buttons:</dt>
                          <dd>{{ template.buttons.length > 0 ? `${template.buttons.length} button(s)` : 'None' }}</dd>
                        </dl>
                      </div>
  
                      <!-- Rejection Reason (if rejected) -->
                      <div v-if="template.status === 'REJECTED'">
                        <h4 class="mb-2 text-sm font-medium">Rejection Details</h4>
                        <dl class="grid grid-cols-[120px_1fr] gap-1 text-sm">
                          <dt class="text-muted-foreground">Reason:</dt>
                          <dd class="text-red-500">{{ template.rejectionReason }}</dd>
                          <dt class="text-muted-foreground">Rejected On:</dt>
                          <dd>{{ template.rejectionDate }}</dd>
                        </dl>
                      </div>
                    </div>
  
                    <!-- Action Buttons -->
                    <div class="mt-4 flex items-center gap-2">
                      <button 
                        @click="editTemplate(template)"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                        :disabled="template.status === 'APPROVED'"
                      >
                        <PencilIcon class="mr-2 h-4 w-4" />
                        Edit
                      </button>
                      <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                        <CopyIcon class="mr-2 h-4 w-4" />
                        Duplicate
                      </button>
                      <button 
                        v-if="template.status === 'REJECTED'"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                      >
                        <RefreshCwIcon class="mr-2 h-4 w-4" />
                        Resubmit
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
  
          <!-- Empty State -->
          <div v-if="filteredTemplates.length === 0" class="flex h-[400px] flex-col items-center justify-center p-8 text-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <MessageSquareIcon class="h-10 w-10 text-green-500" />
            </div>
            <h3 class="mt-4 text-lg font-semibold">No templates found</h3>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ searchQuery ? 'Try adjusting your search or filters.' : 'Get started by creating your first WhatsApp template.' }}
            </p>
            <button 
              v-if="!searchQuery" 
              @click="openAddTemplateSidebar" 
              class="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <PlusIcon class="mr-2 h-4 w-4" />
              Create Template
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
              Showing <strong>1-{{ Math.min(filteredTemplates.length, 10) }}</strong> of <strong>{{ filteredTemplates.length }}</strong> templates
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
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    CopyIcon,
    DownloadIcon,
    FileIcon,
    ImageIcon,
    MessageSquareIcon,
    MoreHorizontalIcon,
    PencilIcon,
    PlusIcon,
    RefreshCwIcon,
    SaveIcon,
    Search,
    SlidersHorizontalIcon,
    TrashIcon,
    VideoIcon,
    XIcon
  } from 'lucide-vue-next';
  
  // Sidebar state
  const showTemplateSidebar = ref(false);
  const editingTemplate = ref<any>(null);
  
  // Template form data
  const template = ref({
    name: '',
    category: '',
    language: '',
    header: {
      format: '',
      text: '',
      example: ''
    },
    body: {
      text: '',
      variables: []
    },
    footer: {
      text: null
    },
    buttons: []
  });
  
  // Button type to add
  const buttonTypeToAdd = ref('QUICK_REPLY');
  
  // Check if we can add more buttons based on type
  const canAddMoreButtons = computed(() => {
    // Count buttons by type
    const quickReplyCount = template.value.buttons.filter(b => b.type === 'QUICK_REPLY').length;
    const urlCount = template.value.buttons.filter(b => b.type === 'URL').length;
    const phoneCount = template.value.buttons.filter(b => b.type === 'PHONE_NUMBER').length;
    const copyCodeCount = template.value.buttons.filter(b => b.type === 'COPY_CODE').length;
    
    // Check limits based on WhatsApp API rules
    if (buttonTypeToAdd.value === 'QUICK_REPLY' && quickReplyCount >= 3) return false;
    if (buttonTypeToAdd.value === 'URL' && urlCount >= 1) return false;
    if (buttonTypeToAdd.value === 'PHONE_NUMBER' && phoneCount >= 1) return false;
    if (buttonTypeToAdd.value === 'COPY_CODE' && copyCodeCount >= 1) return false;
    
    // Check combination rules
    if (buttonTypeToAdd.value !== 'QUICK_REPLY' && (urlCount + phoneCount + copyCodeCount) >= 2) return false;
    
    return true;
  });
  
  // Table state
  const searchQuery = ref('');
  const statusFilter = ref('all');
  const categoryFilter = ref('all');
  const languageFilter = ref('all');
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
    { key: 'name', label: 'Template Name', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'language', label: 'Language', sortable: true, responsiveHide: 'sm' },
    { key: 'createdDate', label: 'Created', sortable: true, responsiveHide: 'md' },
    { key: 'updatedDate', label: 'Updated', sortable: true, responsiveHide: 'md' },
  ];
  
  // Visible columns
  const visibleColumns = ref(['name', 'status', 'category', 'language', 'createdDate', 'updatedDate']);
  
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
    languageFilter.value = 'all';
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
    if (selectedRows.value.length === filteredTemplates.value.length) {
      selectedRows.value = [];
    } else {
      selectedRows.value = filteredTemplates.value.map(template => template.id);
    }
  };
  
  // Check if all rows are selected
  const isAllSelected = computed(() => {
    return filteredTemplates.value.length > 0 && selectedRows.value.length === filteredTemplates.value.length;
  });
  
  // Check if some rows are selected
  const isIndeterminate = computed(() => {
    return selectedRows.value.length > 0 && selectedRows.value.length < filteredTemplates.value.length;
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
  
  // Sort templates
  const sortBy = (column: string) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      sortDirection.value = 'asc';
    }
  };
  
  // Sidebar functions
  const openAddTemplateSidebar = () => {
    // Reset form
    template.value = {
      name: '',
      category: '',
      language: '',
      header: {
        format: '',
        text: '',
        example: ''
      },
      body: {
        text: '',
        variables: []
      },
      footer: {
        text: null
      },
      buttons: []
    };
    editingTemplate.value = null;
    showTemplateSidebar.value = true;
  };
  
  const editTemplate = (templateData: any) => {
    // Populate form with template data
    template.value = {
      name: templateData.name,
      category: templateData.category,
      language: templateData.language,
      header: {
        format: templateData.header.format || '',
        text: templateData.header.text || '',
        example: templateData.header.example || ''
      },
      body: {
        text: templateData.body.text,
        variables: [...templateData.body.variables]
      },
      footer: {
        text: templateData.footer.text
      },
      buttons: [...templateData.buttons]
    };
    
    editingTemplate.value = templateData;
    showTemplateSidebar.value = true;
  };
  
  const closeTemplateSidebar = () => {
    showTemplateSidebar.value = false;
  };
  
  // Template form functions
  const addBodyVariable = () => {
    template.value.body.variables.push({
      example: '',
      description: ''
    });
  };
  
  const removeBodyVariable = (index: number) => {
    template.value.body.variables.splice(index, 1);
  };
  
  const addButton = () => {
    if (!canAddMoreButtons.value) return;
    
    const newButton = {
      type: buttonTypeToAdd.value,
      text: '',
      url: '',
      phoneNumber: '',
      code: ''
    };
    
    template.value.buttons.push(newButton);
  };
  
  const removeButton = (index: number) => {
    template.value.buttons.splice(index, 1);
  };
  
  const getButtonTypeLabel = (type: string) => {
    switch (type) {
      case 'QUICK_REPLY': return 'Quick Reply';
      case 'URL': return 'URL';
      case 'PHONE_NUMBER': return 'Phone Number';
      case 'COPY_CODE': return 'Copy Code';
      default: return type;
    }
  };
  
  // Format body preview with variables
  const getFormattedBodyPreview = () => {
    if (!template.value.body.text) return '';
    
    let content = template.value.body.text;
    template.value.body.variables.forEach((variable, index) => {
      const value = variable.example || `[Variable ${index + 1}]`;
      content = content.replace(`{{${index + 1}}}`, value);
    });
    
    // Replace any remaining {{n}} placeholders
    content = content.replace(/\{\{(\d+)\}\}/g, (match, number) => {
      return `[Variable ${number}]`;
    });
    
    return content;
  };
  
  // Save template
  const saveTemplate = () => {
    if (editingTemplate.value) {
      // Update existing template
      const index = templates.value.findIndex(t => t.id === editingTemplate.value.id);
      if (index !== -1) {
        templates.value[index] = {
          ...editingTemplate.value,
          name: template.value.name,
          category: template.value.category,
          language: template.value.language,
          header: { ...template.value.header },
          body: { ...template.value.body },
          footer: { ...template.value.footer },
          buttons: [...template.value.buttons],
          status: 'PENDING', // Resubmission requires approval
          updatedDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        };
      }
    } else {
      // Add new template
      const newTemplate = {
        id: templates.value.length + 1,
        name: template.value.name,
        category: template.value.category,
        language: template.value.language,
        header: { ...template.value.header },
        body: { ...template.value.body },
        footer: { ...template.value.footer },
        buttons: [...template.value.buttons],
        status: 'PENDING',
        createdDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        updatedDate: null,
        rejectionReason: null,
        rejectionDate: null
      };
      
      templates.value.unshift(newTemplate);
    }
    
    // Close sidebar
    closeTemplateSidebar();
  };
  
  // Filtered templates based on search and filters
  const filteredTemplates = computed(() => {
    let result = [...templates.value];
  
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(template =>
          template.name.toLowerCase().includes(query) ||
          template.body.text.toLowerCase().includes(query)
      );
    }
  
    // Apply status filter
    if (statusFilter.value !== 'all') {
      result = result.filter(template => template.status === statusFilter.value);
    }
  
    // Apply category filter
    if (categoryFilter.value !== 'all') {
      result = result.filter(template => template.category === categoryFilter.value);
    }
  
    // Apply language filter
    if (languageFilter.value !== 'all') {
      result = result.filter(template => template.language === languageFilter.value);
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
        case 'category':
          valueA = a.category;
          valueB = b.category;
          break;
        case 'language':
          valueA = a.language;
          valueB = b.language;
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
  const totalPages = computed(() => Math.ceil(filteredTemplates.value.length / pageSize.value));
  
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
  
  // Sample template data
  const templates = ref([
    {
      id: 1,
      name: 'order_confirmation',
      category: 'UTILITY',
      language: 'en_US',
      header: {
        format: 'TEXT',
        text: 'Order Confirmation',
        example: ''
      },
      body: {
        text: 'Hello {{1}}, your order #{{2}} has been confirmed and is being processed. Expected delivery: {{3}}. Track your order here: {{4}}',
        variables: [
          { example: 'John', description: 'Customer name' },
          { example: 'ORD-12345', description: 'Order number' },
          { example: 'March 25, 2024', description: 'Delivery date' },
          { example: 'https://example.com/track', description: 'Tracking URL' }
        ]
      },
      footer: {
        text: 'Thank you for shopping with us!'
      },
      buttons: [
        {
          type: 'URL',
          text: 'Track Order',
          url: 'https://example.com/track'
        }
      ],
      status: 'APPROVED',
      createdDate: 'Jan 15, 2024',
      updatedDate: 'Jan 16, 2024',
      rejectionReason: null,
      rejectionDate: null
    },
    {
      id: 2,
      name: 'appointment_reminder',
      category: 'UTILITY',
      language: 'en_US',
      header: {
        format: 'TEXT',
        text: 'Appointment Reminder',
        example: ''
      },
      body: {
        text: 'Hello {{1}}, this is a reminder about your appointment on {{2}} at {{3}}. Please reply CONFIRM to confirm or RESCHEDULE to change your appointment.',
        variables: [
          { example: 'Sarah', description: 'Customer name' },
          { example: 'March 30, 2024', description: 'Appointment date' },
          { example: '2:00 PM', description: 'Appointment time' }
        ]
      },
      footer: {
        text: 'Reply HELP for assistance'
      },
      buttons: [
        {
          type: 'QUICK_REPLY',
          text: 'CONFIRM'
        },
        {
          type: 'QUICK_REPLY',
          text: 'RESCHEDULE'
        }
      ],
      status: 'APPROVED',
      createdDate: 'Jan 20, 2024',
      updatedDate: 'Jan 21, 2024',
      rejectionReason: null,
      rejectionDate: null
    },
    {
      id: 3,
      name: 'spring_sale_promotion',
      category: 'MARKETING',
      language: 'en_US',
      header: {
        format: 'IMAGE',
        text: '',
        example: 'https://example.com/spring-sale.jpg'
      },
      body: {
        text: 'Spring is here! Enjoy {{1}}% off all items in our Spring Collection. Sale ends {{2}}. Shop now and refresh your wardrobe!',
        variables: [
          { example: '30', description: 'Discount percentage' },
          { example: 'April 15', description: 'End date' }
        ]
      },
      footer: {
        text: 'Reply STOP to unsubscribe'
      },
      buttons: [
        {
          type: 'URL',
          text: 'Shop Now',
          url: 'https://example.com/spring-sale'
        }
      ],
      status: 'PENDING',
      createdDate: 'Mar 10, 2024',
      updatedDate: null,
      rejectionReason: null,
      rejectionDate: null
    },
    {
      id: 4,
      name: 'account_verification',
      category: 'AUTHENTICATION',
      language: 'en_US',
      header: {
        format: 'TEXT',
        text: 'Account Verification',
        example: ''
      },
      body: {
        text: 'Your verification code is {{1}}. This code will expire in {{2}} minutes. Do not share this code with anyone.',
        variables: [
          { example: '123456', description: 'Verification code' },
          { example: '10', description: 'Expiration time in minutes' }
        ]
      },
      footer: {
        text: 'Sent by Example Company'
      },
      buttons: [
        {
          type: 'COPY_CODE',
          text: 'Copy Code',
          code: '123456'
        }
      ],
      status: 'APPROVED',
      createdDate: 'Feb 5, 2024',
      updatedDate: 'Feb 6, 2024',
      rejectionReason: null,
      rejectionDate: null
    },
    {
      id: 5,
      name: 'customer_feedback',
      category: 'UTILITY',
      language: 'en_US',
      header: {
        format: 'TEXT',
        text: 'We Value Your Feedback',
        example: ''
      },
      body: {
        text: "Hello {{1}}, thank you for your recent purchase! We'd love to hear your thoughts. How would you rate your experience with us?",
        variables: [
          { example: 'Michael', description: 'Customer name' }
        ]
      },
      footer: {
        text: 'Your feedback helps us improve'
      },
      buttons: [
        {
          type: 'QUICK_REPLY',
          text: 'Excellent'
        },
        {
          type: 'QUICK_REPLY',
          text: 'Good'
        },
        {
          type: 'QUICK_REPLY',
          text: 'Needs Improvement'
        }
      ],
      status: 'REJECTED',
      createdDate: 'Feb 15, 2024',
      updatedDate: 'Feb 18, 2024',
      rejectionReason: 'Template contains rating system which is not allowed in this format. Please use a different approach for collecting ratings.',
      rejectionDate: 'Feb 18, 2024'
    },
    {
      id: 6,
      name: 'shipping_update',
      category: 'UTILITY',
      language: 'en_US',
      header: {
        format: 'TEXT',
        text: 'Shipping Update',
        example: ''
      },
      body: {
        text: 'Hello {{1}}, your order #{{2}} has been shipped! It should arrive by {{3}}. Track your package here: {{4}}',
        variables: [
          { example: 'Emily', description: 'Customer name' },
          { example: 'ORD-67890', description: 'Order number' },
          { example: 'April 10, 2024', description: 'Delivery date' },
          { example: 'https://example.com/track', description: 'Tracking URL' }
        ]
      },
      footer: {
        text: 'Thank you for your patience'
      },
      buttons: [
        {
          type: 'URL',
          text: 'Track Package',
          url: 'https://example.com/track'
        }
      ],
      status: 'APPROVED',
      createdDate: 'Feb 25, 2024',
      updatedDate: 'Feb 26, 2024',
      rejectionReason: null,
      rejectionDate: null
    },
    {
      id: 7,
      name: 'payment_reminder',
      category: 'UTILITY',
      language: 'en_US',
      header: {
        format: 'TEXT',
        text: 'Payment Reminder',
        example: ''
      },
      body: {
        text: 'Hello {{1}}, this is a friendly reminder that your payment of ${{2}} is due on {{3}}. Please ensure timely payment to avoid any service interruptions.',
        variables: [
          { example: 'Robert', description: 'Customer name' },
          { example: '99.99', description: 'Payment amount' },
          { example: 'April 1, 2024', description: 'Due date' }
        ]
      },
      footer: {
        text: 'Contact support for assistance'
      },
      buttons: [
        {
          type: 'URL',
          text: 'Pay Now',
          url: 'https://example.com/pay'
        },
        {
          type: 'PHONE_NUMBER',
          text: 'Call Support',
          phoneNumber: '+18001234567'
        }
      ],
      status: 'PENDING',
      createdDate: 'Mar 15, 2024',
      updatedDate: null,
      rejectionReason: null,
      rejectionDate: null
    }
  ]);
  </script>
  
  <style scoped>
  /* Add any additional custom styling here */
  </style>