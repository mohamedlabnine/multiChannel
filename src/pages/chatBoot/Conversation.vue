<template>
    <div class="flex h-full">
      <!-- Sidebar for adding/editing chatbots -->
      <div 
        class="fixed inset-y-0 right-0 z-20 flex w-full md:w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out"
        :class="showEditSidebar ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="flex h-14 items-center justify-between border-b px-4">
          <h2 class="text-lg font-semibold">{{ editingBot ? 'Edit Chatbot' : 'New Chatbot' }}</h2>
          <button 
            @click="closeEditSidebar" 
            class="rounded-full p-1 hover:bg-muted"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>
        
        <!-- Bot Form -->
        <div class="flex-1 overflow-auto p-4">
          <form @submit.prevent="saveBot" class="space-y-6 max-w-3xl mx-auto">
            <!-- Basic Information -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-muted-foreground">Bot Details</h3>
              
              <div class="space-y-2">
                <label for="botName" class="text-sm font-medium">Bot Name</label>
                <input 
                  id="botName" 
                  v-model="botForm.name" 
                  type="text" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Enter bot name"
                  required
                />
              </div>
              
              <div class="space-y-2">
                <label for="description" class="text-sm font-medium">Description</label>
                <textarea 
                  id="description" 
                  v-model="botForm.description" 
                  rows="2" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Enter bot description"
                ></textarea>
              </div>
              
              <div class="space-y-2">
                <label for="welcomeMessage" class="text-sm font-medium">Welcome Message</label>
                <input 
                  id="welcomeMessage" 
                  v-model="botForm.welcomeMessage" 
                  type="text" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Enter welcome message"
                  required
                />
              </div>
            </div>
            
            <!-- Conversation Flow Builder -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-muted-foreground">Conversation Flow</h3>
              
              <div class="space-y-4 rounded-md border p-4">
                <div v-for="(node, index) in botForm.flow" :key="index" class="border border-input rounded-md p-4 bg-muted/20">
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="text-sm font-medium">Node {{ index + 1 }}</h4>
                    <button @click="removeNode(index)" class="text-destructive hover:text-destructive/80">
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div class="space-y-3">
                    <div>
                      <label class="block text-xs font-medium text-muted-foreground mb-1">Message</label>
                      <input 
                        v-model="node.message" 
                        type="text" 
                        class="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Bot message"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-xs font-medium text-muted-foreground mb-1">Type</label>
                      <select 
                        v-model="node.type" 
                        class="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="text">Text Response</option>
                        <option value="input">User Input</option>
                        <option value="conditional">Conditional</option>
                        <option value="capture">Capture Data</option>
                      </select>
                    </div>
                    
                    <!-- Conditional Logic -->
                    <div v-if="node.type === 'conditional'" class="space-y-2">
                      <div class="flex items-center space-x-2">
                        <label class="text-xs font-medium text-muted-foreground">If</label>
                        <select 
                          v-model="node.condition.field" 
                          class="px-2 py-1 border border-input bg-background rounded-md text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="input">User Input</option>
                          <option value="name">Name</option>
                          <option value="email">Email</option>
                        </select>
                        <select 
                          v-model="node.condition.operator" 
                          class="px-2 py-1 border border-input bg-background rounded-md text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="contains">contains</option>
                          <option value="equals">equals</option>
                          <option value="startsWith">starts with</option>
                        </select>
                        <input 
                          v-model="node.condition.value" 
                          type="text" 
                          class="flex-1 px-2 py-1 border border-input bg-background rounded-md text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Value"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-muted-foreground mb-1">Then go to node</label>
                        <select 
                          v-model="node.condition.nextNodeTrue" 
                          class="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option v-for="i in botForm.flow.length" :key="i" :value="i-1">Node {{ i }}</option>
                          <option value="end">End Conversation</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-muted-foreground mb-1">Else go to node</label>
                        <select 
                          v-model="node.condition.nextNodeFalse" 
                          class="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option v-for="i in botForm.flow.length" :key="i" :value="i-1">Node {{ i }}</option>
                          <option value="end">End Conversation</option>
                        </select>
                      </div>
                    </div>
                    
                    <!-- Capture Data Fields -->
                    <div v-if="node.type === 'capture'" class="space-y-2">
                      <div>
                        <label class="block text-xs font-medium text-muted-foreground mb-1">Capture Field</label>
                        <select 
                          v-model="node.captureField" 
                          class="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="name">Name</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="custom">Custom Field</option>
                        </select>
                      </div>
                      <div v-if="node.captureField === 'custom'">
                        <label class="block text-xs font-medium text-muted-foreground mb-1">Custom Field Name</label>
                        <input 
                          v-model="node.customFieldName" 
                          type="text" 
                          class="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Enter field name"
                        />
                      </div>
                    </div>
                    
                    <!-- Next Node -->
                    <div v-if="node.type !== 'conditional'">
                      <label class="block text-xs font-medium text-muted-foreground mb-1">Next Node</label>
                      <select 
                        v-model="node.nextNode" 
                        class="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option v-for="i in botForm.flow.length" :key="i" :value="i-1">Node {{ i }}</option>
                        <option value="end">End Conversation</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <button 
                  @click="addNode()" 
                  type="button"
                  class="w-full py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 flex items-center justify-center"
                >
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Add Node
                </button>
              </div>
            </div>
            
            <!-- Save Button -->
            <div class="flex justify-end">
              <button 
                type="submit" 
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                <SaveIcon class="mr-2 h-4 w-4" />
                {{ editingBot ? 'Update Bot' : 'Create Bot' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Sidebar for integration -->
      <div 
        class="fixed inset-y-0 right-0 z-20 flex w-full md:w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out"
        :class="showIntegrationSidebar ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="flex h-14 items-center justify-between border-b px-4">
          <h2 class="text-lg font-semibold">Integration</h2>
          <button 
            @click="closeIntegrationSidebar" 
            class="rounded-full p-1 hover:bg-muted"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>
        
        <!-- Integration Content -->
        <div class="flex-1 overflow-auto p-4">
          <div class="space-y-6 max-w-3xl mx-auto">
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-muted-foreground">Select a Bot to Integrate</h3>
              
              <div class="space-y-2">
                <select 
                  v-model="selectedBotForIntegration" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select a bot</option>
                  <option v-for="bot in bots.filter(b => b.active)" :key="bot.id" :value="bot.id">{{ bot.name }}</option>
                </select>
              </div>
              
              <div v-if="selectedBotForIntegration" class="space-y-4">
                <div>
                  <h4 class="text-sm font-medium mb-2">Integration Script</h4>
                  <div class="bg-muted/30 p-4 rounded-md">
                    <pre class="text-xs text-foreground overflow-x-auto whitespace-pre-wrap">{{ generateIntegrationScript(selectedBotForIntegration) }}</pre>
                  </div>
                </div>
                
                <div>
                  <button 
                    @click="copyIntegrationScript()" 
                    class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                  >
                    <CopyIcon class="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </button>
                </div>
                
                <div class="border-t border-border pt-4">
                  <h4 class="text-sm font-medium mb-2">Customization Options</h4>
                  
                  <div class="space-y-3">
                    <div>
                      <label class="block text-xs font-medium text-muted-foreground mb-1">Position</label>
                      <select 
                        v-model="integrationOptions.position" 
                        class="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-xs font-medium text-muted-foreground mb-1">Theme Color</label>
                      <input 
                        v-model="integrationOptions.themeColor" 
                        type="color" 
                        class="w-full h-10 px-3 py-2 border border-input bg-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    
                    <div class="flex items-center">
                      <input 
                        v-model="integrationOptions.autoOpen" 
                        type="checkbox" 
                        id="autoOpen" 
                        class="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                      />
                      <label for="autoOpen" class="ml-2 block text-sm">Auto-open after 5 seconds</label>
                    </div>
                  </div>
                </div>
                
                <div class="border-t border-border pt-4">
                  <h4 class="text-sm font-medium mb-2">Preview</h4>
                  <div class="border border-input rounded-md p-4 bg-muted/20">
                    <div class="max-w-xs mx-auto">
                      <div class="flex flex-col items-end mb-4">
                        <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-2 shadow-md" :style="{ backgroundColor: integrationOptions.themeColor }">
                          <MessageSquareIcon class="h-6 w-6" />
                        </div>
                        <div class="w-64 rounded-lg border border-input bg-card shadow-md">
                          <div class="p-3 border-b flex items-center justify-between">
                            <h5 class="font-medium">{{ getBotName(selectedBotForIntegration) }}</h5>
                            <button class="text-muted-foreground hover:text-foreground">
                              <XIcon class="h-4 w-4" />
                            </button>
                          </div>
                          <div class="p-3 h-48 overflow-y-auto">
                            <div class="bg-muted p-2 rounded-md text-sm mb-2 max-w-[80%]">
                              {{ getSelectedBot(selectedBotForIntegration)?.welcomeMessage || 'Hello! How can I help you today?' }}
                            </div>
                            <div class="bg-primary/10 p-2 rounded-md text-sm ml-auto mb-2 max-w-[80%]">
                              I have a question about your services.
                            </div>
                            <div class="bg-muted p-2 rounded-md text-sm max-w-[80%]">
                              I'd be happy to help! What would you like to know?
                            </div>
                          </div>
                          <div class="p-3 border-t flex items-center">
                            <input type="text" placeholder="Type your message..." class="flex-1 bg-transparent border-0 focus:outline-none text-sm" />
                            <button class="ml-2 text-primary">
                              <SendIcon class="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sidebar for viewing leads -->
      <div 
        class="fixed inset-y-0 right-0 z-20 flex w-full md:w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out"
        :class="showLeadsSidebar ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="flex h-14 items-center justify-between border-b px-4">
          <h2 class="text-lg font-semibold">Captured Leads</h2>
          <button 
            @click="closeLeadsSidebar" 
            class="rounded-full p-1 hover:bg-muted"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>
        
        <!-- Leads Content -->
        <div class="flex-1 overflow-auto">
          <div class="p-4 border-b">
            <div class="relative">
              <SearchIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                v-model="leadSearchQuery"
                placeholder="Search leads..."
                class="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead class="sticky top-0 z-10 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/30">
                <tr>
                  <th class="px-4 py-3 text-left">
                    <span class="text-sm font-medium text-muted-foreground">Name</span>
                  </th>
                  <th class="px-4 py-3 text-left">
                    <span class="text-sm font-medium text-muted-foreground">Email</span>
                  </th>
                  <th class="px-4 py-3 text-left hidden md:table-cell">
                    <span class="text-sm font-medium text-muted-foreground">Phone</span>
                  </th>
                  <th class="px-4 py-3 text-left hidden md:table-cell">
                    <span class="text-sm font-medium text-muted-foreground">Bot</span>
                  </th>
                  <th class="px-4 py-3 text-left hidden lg:table-cell">
                    <span class="text-sm font-medium text-muted-foreground">Date</span>
                  </th>
                  <th class="px-4 py-3 text-right">
                    <span class="text-sm font-medium text-muted-foreground">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(lead, index) in filteredLeads" :key="index" class="border-b">
                  <td class="px-4 py-3">
                    <div class="font-medium">{{ lead.name }}</div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="text-sm">{{ lead.email }}</div>
                  </td>
                  <td class="px-4 py-3 hidden md:table-cell">
                    <div class="text-sm">{{ lead.phone }}</div>
                  </td>
                  <td class="px-4 py-3 hidden md:table-cell">
                    <div class="text-sm">{{ getBotName(lead.botId) }}</div>
                  </td>
                  <td class="px-4 py-3 hidden lg:table-cell">
                    <div class="text-sm">{{ formatDate(lead.date) }}</div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
                      View
                    </button>
                  </td>
                </tr>
                
                <!-- Empty State -->
                <tr v-if="filteredLeads.length === 0">
                  <td colspan="6" class="px-4 py-8 text-center">
                    <div class="flex flex-col items-center justify-center">
                      <UserIcon class="h-8 w-8 text-muted-foreground/50" />
                      <h3 class="mt-2 text-sm font-medium">No leads found</h3>
                      <p class="mt-1 text-xs text-muted-foreground">
                        {{ leadSearchQuery ? 'Try adjusting your search.' : 'Leads will appear here once users interact with your chatbots.' }}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Sidebar Footer -->
        <div class="border-t p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">
                Showing <strong>{{ filteredLeads.length }}</strong> of <strong>{{ leads.length }}</strong> leads
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button 
                type="button"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                <DownloadIcon class="mr-2 h-4 w-4" />
                Export Leads
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Overlay when sidebar is open -->
      <div 
        v-if="showEditSidebar || showIntegrationSidebar || showLeadsSidebar" 
        class="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm"
        @click="closeAllSidebars"
      ></div>
  
      <!-- Main Content -->
      <div class="flex h-full w-full flex-col">
        <!-- Page Header -->
        <header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div class="flex h-14 items-center gap-4 px-4 sm:px-6">
            <h1 class="text-lg font-semibold">Chatbot Management</h1>
            <div class="ml-auto flex items-center gap-2">
              <div class="relative">
                <SearchIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  v-model="searchQuery"
                  placeholder="Search chatbots..."
                  class="h-9 w-[180px] rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-[240px]"
                />
              </div>
              <button 
                @click="openAddBotSidebar"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                <PlusIcon class="mr-2 h-4 w-4" />
                New Chatbot
              </button>
            </div>
          </div>
        </header>
  
        <!-- Tabs -->
        <div class="border-b px-4 py-2 sm:px-6">
          <div class="flex space-x-4">
            <button 
              @click="activeTab = 'bots'" 
              class="px-2 py-1 text-sm font-medium border-b-2 transition-colors"
              :class="activeTab === 'bots' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
            >
              Chatbots
            </button>
            <button 
              @click="activeTab = 'conversations'" 
              class="px-2 py-1 text-sm font-medium border-b-2 transition-colors"
              :class="activeTab === 'conversations' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
            >
              Conversations
            </button>
            <button 
              @click="activeTab = 'leads'" 
              class="px-2 py-1 text-sm font-medium border-b-2 transition-colors"
              :class="activeTab === 'leads' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
            >
              Leads
            </button>
            <button 
              @click="activeTab = 'analytics'" 
              class="px-2 py-1 text-sm font-medium border-b-2 transition-colors"
              :class="activeTab === 'analytics' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'"
            >
              Analytics
            </button>
          </div>
        </div>
  
        <!-- Bots Tab -->
        <div v-if="activeTab === 'bots'" class="flex-1 overflow-auto p-4 sm:p-6">
          <!-- Data Table Controls -->
          <div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <!-- Bulk Actions (visible when rows are selected) -->
            <div v-if="selectedBots.length > 0" class="flex items-center gap-2">
              <span class="text-sm font-medium">{{ selectedBots.length }} selected</span>
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
                  <option value="all">All Bots</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Data Table -->
          <div class="rounded-md border">
            <table class="w-full border-collapse">
              <thead class="bg-muted/50">
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
                  <th class="px-4 py-3 text-left">
                    <span class="text-sm font-medium text-muted-foreground">Name</span>
                  </th>
                  <th class="px-4 py-3 text-left">
                    <span class="text-sm font-medium text-muted-foreground">Status</span>
                  </th>
                  <th class="px-4 py-3 text-left hidden md:table-cell">
                    <span class="text-sm font-medium text-muted-foreground">Conversations</span>
                  </th>
                  <th class="px-4 py-3 text-left hidden md:table-cell">
                    <span class="text-sm font-medium text-muted-foreground">Leads</span>
                  </th>
                  <th class="px-4 py-3 text-right">
                    <span class="text-sm font-medium text-muted-foreground">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="bot in filteredBots" 
                  :key="bot.id" 
                  class="border-b transition-colors hover:bg-muted/50"
                  :class="{ 'bg-muted/30': selectedBots.includes(bot.id) }"
                >
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <input
                        type="checkbox"
                        :checked="selectedBots.includes(bot.id)"
                        @change="toggleBotSelection(bot.id)"
                        class="h-4 w-4 rounded border-input bg-background"
                      />
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-10 overflow-hidden rounded bg-muted flex items-center justify-center">
                        <MessageSquareIcon class="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div class="font-medium">{{ bot.name }}</div>
                        <div class="text-xs text-muted-foreground truncate max-w-[200px]">{{ bot.description }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                      :class="{
                        'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': bot.active,
                        'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300': !bot.active
                      }"
                    >
                      {{ bot.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 hidden md:table-cell">
                    <div class="text-sm">{{ bot.conversationCount }}</div>
                  </td>
                  <td class="px-4 py-3 hidden md:table-cell">
                    <div class="text-sm">{{ bot.leadCount }}</div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button 
                        @click="toggleBotStatus(bot)" 
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                      >
                        {{ bot.active ? 'Deactivate' : 'Activate' }}
                      </button>
                      <button 
                        @click="openIntegrationSidebarWithBot(bot.id)" 
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                      >
                        <CodeIcon class="h-3 w-3 mr-1" />
                        Integrate
                      </button>
                      <div class="relative">
                        <button
                          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
                          @click="toggleActionMenu(bot.id)"
                        >
                          <MoreHorizontalIcon class="h-4 w-4" />
                        </button>
  
                        <!-- Action Menu Dropdown -->
                        <div
                          v-if="actionMenuOpen === bot.id"
                          class="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border bg-card p-1 shadow-md"
                        >
                          <button 
                            @click="editBot(bot)" 
                            class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                          >
                            <PencilIcon class="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button 
                            @click="viewBotConversations(bot.id)" 
                            class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                          >
                            <MessageSquareIcon class="h-4 w-4" />
                            <span>Conversations</span>
                          </button>
                          <button class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
                            <CopyIcon class="h-4 w-4" />
                            <span>Duplicate</span>
                          </button>
                          <div class="my-1 h-px bg-border"></div>
                          <button 
                            @click="deleteBot(bot.id)" 
                            class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                          >
                            <TrashIcon class="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Empty State -->
          <div v-if="filteredBots.length === 0" class="flex h-[400px] flex-col items-center justify-center p-8 text-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <MessageSquareIcon class="h-10 w-10 text-primary" />
            </div>
            <h3 class="mt-4 text-lg font-semibold">No chatbots found</h3>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ searchQuery ? 'Try adjusting your search.' : 'Get started by creating your first chatbot.' }}
            </p>
            <button 
              v-if="!searchQuery" 
              @click="openAddBotSidebar" 
              class="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <PlusIcon class="mr-2 h-4 w-4" />
              New Chatbot
            </button>
          </div>
        </div>
  
        <!-- Conversations Tab -->
        <div v-if="activeTab === 'conversations'" class="flex-1 overflow-auto p-4 sm:p-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            <!-- Bot Selection Panel -->
            <div class="border rounded-md overflow-hidden">
              <div class="bg-muted/50 px-4 py-3 border-b">
                <h3 class="text-sm font-medium">Select Bot</h3>
              </div>
              <div class="p-2">
                <div class="relative mb-2">
                  <SearchIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    v-model="botSearchQuery"
                    placeholder="Search bots..."
                    class="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div class="space-y-1 max-h-[calc(100vh-20rem)] overflow-y-auto">
                  <button
                    v-for="bot in filteredBotsForConversation"
                    :key="bot.id"
                    @click="selectBotForConversation(bot.id)"
                    class="w-full flex items-center gap-2 p-2 rounded-md text-sm"
                    :class="selectedBotId === bot.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'"
                  >
                    <div class="h-8 w-8 overflow-hidden rounded bg-muted flex items-center justify-center">
                      <MessageSquareIcon class="h-4 w-4 text-primary" />
                    </div>
                    <div class="flex-1 text-left">
                      <div class="font-medium">{{ bot.name }}</div>
                      <div class="text-xs text-muted-foreground truncate">{{ bot.conversationCount }} conversations</div>
                    </div>
                    <span
                      class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs"
                      :class="{
                        'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': bot.active,
                        'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300': !bot.active
                      }"
                    >
                      {{ bot.active ? 'Active' : 'Inactive' }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Conversation List Panel -->
            <div class="border rounded-md overflow-hidden">
              <div class="bg-muted/50 px-4 py-3 border-b">
                <h3 class="text-sm font-medium">Conversations</h3>
              </div>
              <div class="p-2">
                <div class="relative mb-2">
                  <SearchIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    v-model="conversationSearchQuery"
                    placeholder="Search conversations..."
                    class="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div class="space-y-1 max-h-[calc(100vh-20rem)] overflow-y-auto">
                  <button
                    v-for="conversation in filteredConversationsForBot"
                    :key="conversation.id"
                    @click="selectConversationForChat(conversation.id)"
                    class="w-full flex flex-col p-2 rounded-md text-sm text-left"
                    :class="selectedConversationId === conversation.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'"
                  >
                    <div class="flex justify-between items-center mb-1">
                      <div class="font-medium">Visitor #{{ conversation.visitorId }}</div>
                      <span :class="[
                        conversation.completed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                        'px-2 py-0.5 text-xs rounded-full'
                      ]">
                        {{ conversation.completed ? 'Completed' : 'In Progress' }}
                      </span>
                    </div>
                    <div class="text-xs text-muted-foreground">{{ formatDate(conversation.date) }}</div>
                    <div class="text-xs truncate mt-1">
                      {{ conversation.messages[conversation.messages.length - 1].text }}
                    </div>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Conversation Detail Panel -->
            <div class="border rounded-md overflow-hidden flex flex-col">
              <div class="bg-muted/50 px-4 py-3 border-b">
                <h3 class="text-sm font-medium">
                  {{ selectedConversationForChat ? 'Conversation with Visitor #' + selectedConversationForChat.visitorId : 'Select a Conversation' }}
                </h3>
              </div>
              
              <div v-if="selectedConversationForChat" class="flex-1 flex flex-col">
                <!-- Captured Data -->
                <div v-if="selectedConversationForChat.capturedData" class="p-3 border-b">
                  <h4 class="text-xs font-medium mb-1 text-muted-foreground">Captured Data</h4>
                  <div class="grid grid-cols-2 gap-2">
                    <div v-for="(value, key) in selectedConversationForChat.capturedData" :key="key" class="text-sm">
                      <span class="text-muted-foreground">{{ formatFieldName(key) }}:</span> 
                      <span class="font-medium">{{ value }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Messages -->
                <div class="flex-1 overflow-y-auto p-3" ref="chatMessagesContainer">
                  <div class="space-y-3">
                    <div v-for="(message, index) in selectedConversationForChat.messages" :key="index" class="flex">
                      <div :class="[
                        'max-w-[80%] p-2 rounded-lg text-sm',
                        message.sender === 'bot' 
                          ? 'bg-muted text-foreground mr-auto' 
                          : 'bg-primary/10 text-primary ml-auto'
                      ]">
                        {{ message.text }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Reply Form (for in-progress conversations) -->
                <div v-if="!selectedConversationForChat.completed" class="p-3 border-t">
                  <div class="flex items-center gap-2">
                    <textarea 
                      v-model="replyMessage" 
                      rows="2" 
                      class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                      placeholder="Type your response..."
                    ></textarea>
                    <div class="flex flex-col gap-2">
                      <button 
                        @click="sendReplyToChat()" 
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                        :disabled="!replyMessage.trim()"
                      >
                        <SendIcon class="h-4 w-4" />
                      </button>
                      <button 
                        @click="markChatAsCompleted()" 
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                      >
                        <CheckIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Empty State -->
              <div v-else class="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <MessageSquareIcon class="h-12 w-12 text-muted-foreground mb-4" />
                <h3 class="text-lg font-medium mb-1">No conversation selected</h3>
                <p class="text-sm text-muted-foreground">
                  Select a bot and a conversation to view details and respond
                </p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Leads Tab -->
        <div v-if="activeTab === 'leads'" class="flex-1 overflow-auto p-4 sm:p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium">Captured Leads</h2>
              <button 
                @click="openLeadsSidebar" 
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              >
                View All
              </button>
            </div>
            
            <div class="bg-card rounded-lg shadow border border-border overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="bg-muted/50">
                      <th class="px-4 py-3 text-left">
                        <span class="text-sm font-medium text-muted-foreground">Name</span>
                      </th>
                      <th class="px-4 py-3 text-left">
                        <span class="text-sm font-medium text-muted-foreground">Email</span>
                      </th>
                      <th class="px-4 py-3 text-left hidden md:table-cell">
                        <span class="text-sm font-medium text-muted-foreground">Phone</span>
                      </th>
                      <th class="px-4 py-3 text-left hidden md:table-cell">
                        <span class="text-sm font-medium text-muted-foreground">Bot</span>
                      </th>
                      <th class="px-4 py-3 text-left hidden lg:table-cell">
                        <span class="text-sm font-medium text-muted-foreground">Date</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(lead, index) in leads.slice(0, 5)" :key="index" class="border-b">
                      <td class="px-4 py-3">
                        <div class="font-medium">{{ lead.name }}</div>
                      </td>
                      <td class="px-4 py-3">
                        <div class="text-sm">{{ lead.email }}</div>
                      </td>
                      <td class="px-4 py-3 hidden md:table-cell">
                        <div class="text-sm">{{ lead.phone }}</div>
                      </td>
                      <td class="px-4 py-3 hidden md:table-cell">
                        <div class="text-sm">{{ getBotName(lead.botId) }}</div>
                      </td>
                      <td class="px-4 py-3 hidden lg:table-cell">
                        <div class="text-sm">{{ formatDate(lead.date) }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="leads.length === 0" class="flex h-[300px] flex-col items-center justify-center p-8 text-center">
              <UserIcon class="h-12 w-12 text-muted-foreground mb-4" />
              <h3 class="text-lg font-medium mb-1">No leads captured yet</h3>
              <p class="text-sm text-muted-foreground">
                Leads will appear here once users interact with your chatbots.
              </p>
            </div>
          </div>
        </div>
  
        <!-- Analytics Tab -->
        <div v-if="activeTab === 'analytics'" class="flex-1 overflow-auto p-4 sm:p-6">
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-card rounded-lg shadow border border-border p-6">
                <h3 class="text-sm font-medium text-muted-foreground">Total Conversations</h3>
                <p class="mt-2 text-3xl font-semibold">{{ analytics.totalConversations }}</p>
                <p class="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUpIcon class="h-4 w-4 mr-1" />
                  <span>12% from last month</span>
                </p>
              </div>
              
              <div class="bg-card rounded-lg shadow border border-border p-6">
                <h3 class="text-sm font-medium text-muted-foreground">Leads Captured</h3>
                <p class="mt-2 text-3xl font-semibold">{{ analytics.leadsCount }}</p>
                <p class="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUpIcon class="h-4 w-4 mr-1" />
                  <span>8% from last month</span>
                </p>
              </div>
              
              <div class="bg-card rounded-lg shadow border border-border p-6">
                <h3 class="text-sm font-medium text-muted-foreground">Conversion Rate</h3>
                <p class="mt-2 text-3xl font-semibold">{{ analytics.conversionRate }}%</p>
                <p class="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <ArrowDownIcon class="h-4 w-4 mr-1" />
                  <span>3% from last month</span>
                </p>
              </div>
            </div>
            
            <div class="bg-card rounded-lg shadow border border-border p-6">
              <h3 class="text-md font-medium mb-4">Conversations by Bot</h3>
              <div class="h-64 flex items-center justify-center">
                <div class="text-center text-muted-foreground">
                  <BarChartIcon class="h-12 w-12 mx-auto mb-2" />
                  <p>Analytics chart would appear here</p>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-card rounded-lg shadow border border-border p-6">
                <h3 class="text-md font-medium mb-4">Popular Questions</h3>
                <ul class="space-y-2">
                  <li v-for="(question, index) in analytics.popularQuestions" :key="index" class="flex items-center justify-between">
                    <span class="text-sm">{{ question.text }}</span>
                    <span class="text-sm font-medium">{{ question.count }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="bg-card rounded-lg shadow border border-border p-6">
                <h3 class="text-md font-medium mb-4">Conversation Duration</h3>
                <div class="h-48 flex items-center justify-center">
                  <div class="text-center text-muted-foreground">
                    <ClockIcon class="h-12 w-12 mx-auto mb-2" />
                    <p>Duration chart would appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, nextTick, watch } from 'vue';
  import {
    ArrowDownIcon,
    ArrowUpIcon,
    BarChartIcon,
    CheckIcon,
    ClockIcon,
    CodeIcon,
    CopyIcon,
    DownloadIcon,
    MessageSquareIcon,
    MoreHorizontalIcon,
    PaperclipIcon,
    PencilIcon,
    PlusIcon,
    SaveIcon,
    SearchIcon,
    SendIcon,
    SmileIcon,
    TrashIcon,
    UserIcon,
    XIcon
  } from 'lucide-vue-next';
  
  // State
  const activeTab = ref('bots');
  const showEditSidebar = ref(false);
  const showIntegrationSidebar = ref(false);
  const showLeadsSidebar = ref(false);
  const searchQuery = ref('');
  const conversationSearchQuery = ref('');
  const leadSearchQuery = ref('');
  const botSearchQuery = ref('');
  const editingBot = ref(null);
  const replyMessage = ref('');
  const messagesContainer = ref(null);
  const chatMessagesContainer = ref(null);
  const selectedBots = ref([]);
  const statusFilter = ref('all');
  const actionMenuOpen = ref(null);
  
  // Conversation view state
  const selectedBotId = ref(null);
  const selectedConversationId = ref(null);
  const selectedConversationForChat = ref(null);
  
  // Bot form data
  const botForm = ref({
    id: '',
    name: '',
    description: '',
    welcomeMessage: 'Hello! How can I help you today?',
    flow: [
      {
        message: 'Hello! How can I help you today?',
        type: 'text',
        nextNode: 'end'
      }
    ]
  });
  
  // Integration options
  const selectedBotForIntegration = ref('');
  const integrationOptions = ref({
    position: 'bottom-right',
    themeColor: '#4f46e5',
    autoOpen: false
  });
  
  // Sample data
  const bots = ref([
    {
      id: '1',
      name: 'Customer Support Bot',
      description: 'Helps customers with common questions',
      active: true,
      welcomeMessage: 'Hello! How can I help you today?',
      conversationCount: 156,
      leadCount: 42,
      flow: [
        {
          message: 'Hello! How can I help you today?',
          type: 'text',
          nextNode: 1
        },
        {
          message: 'Would you like to know about our products or services?',
          type: 'input',
          nextNode: 2
        },
        {
          message: 'Based on your input',
          type: 'conditional',
          condition: {
            field: 'input',
            operator: 'contains',
            value: 'product',
            nextNodeTrue: 3,
            nextNodeFalse: 4
          }
        },
        {
          message: 'Great! We offer a range of products. Can I get your email to send you more information?',
          type: 'capture',
          captureField: 'email',
          nextNode: 5
        },
        {
          message: 'Our services include consulting and implementation. Can I get your email to send you more information?',
          type: 'capture',
          captureField: 'email',
          nextNode: 5
        },
        {
          message: 'Thank you! A representative will contact you soon.',
          type: 'text',
          nextNode: 'end'
        }
      ]
    },
    {
      id: '2',
      name: 'Lead Generation Bot',
      description: 'Captures leads for sales team',
      active: false,
      welcomeMessage: 'Hi there! Interested in our solutions?',
      conversationCount: 89,
      leadCount: 31,
      flow: [
        {
          message: 'Hi there! Interested in our solutions?',
          type: 'text',
          nextNode: 1
        },
        {
          message: 'What\'s your name?',
          type: 'capture',
          captureField: 'name',
          nextNode: 2
        },
        {
          message: 'Nice to meet you! What\'s your email address?',
          type: 'capture',
          captureField: 'email',
          nextNode: 3
        },
        {
          message: 'Thanks! Our team will reach out to you shortly.',
          type: 'text',
          nextNode: 'end'
        }
      ]
    }
  ]);
  
  const conversations = ref([
    {
      id: '1',
      botId: '1',
      visitorId: '12345',
      date: new Date(2023, 5, 19, 14, 30),
      completed: true,
      capturedData: {
        email: 'john@example.com'
      },
      messages: [
        { sender: 'bot', text: 'Hello! How can I help you today?' },
        { sender: 'user', text: 'I need information about your products' },
        { sender: 'bot', text: 'Great! We offer a range of products. Can I get your email to send you more information?' },
        { sender: 'user', text: 'sure, it\'s john@example.com' },
        { sender: 'bot', text: 'Thank you! A representative will contact you soon.' }
      ]
    },
    {
      id: '2',
      botId: '2',
      visitorId: '67890',
      date: new Date(2023, 5, 19, 16, 45),
      completed: false,
      capturedData: {
        name: 'Alice Brown'
      },
      messages: [
        { sender: 'bot', text: 'Hi there! Interested in our solutions?' },
        { sender: 'user', text: 'Yes, I\'d like to know more' },
        { sender: 'bot', text: 'What\'s your name?' },
        { sender: 'user', text: 'Alice Brown' }
      ]
    },
    {
      id: '3',
      botId: '1',
      visitorId: '54321',
      date: new Date(2023, 5, 18, 10, 15),
      completed: true,
      capturedData: {
        email: 'robert@example.com'
      },
      messages: [
        { sender: 'bot', text: 'Hello! How can I help you today?' },
        { sender: 'user', text: 'Do you offer consulting services?' },
        { sender: 'bot', text: 'Our services include consulting and implementation. Can I get your email to send you more information?' },
        { sender: 'user', text: 'robert@example.com' },
        { sender: 'bot', text: 'Thank you! A representative will contact you soon.' }
      ]
    },
    {
      id: '4',
      botId: '2',
      visitorId: '13579',
      date: new Date(2023, 5, 17, 9, 30),
      completed: true,
      capturedData: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1234567890'
      },
      messages: [
        { sender: 'bot', text: 'Hi there! Interested in our solutions?' },
        { sender: 'user', text: 'Yes, I am' },
        { sender: 'bot', text: 'What\'s your name?' },
        { sender: 'user', text: 'Sarah Johnson' },
        { sender: 'bot', text: 'Nice to meet you! What\'s your email address?' },
        { sender: 'user', text: 'sarah@example.com' },
        { sender: 'bot', text: 'Thanks! Our team will reach out to you shortly.' }
      ]
    }
  ]);
  
  const leads = ref([
    { name: 'John Doe', email: 'john@example.com', phone: '+1234567890', botId: '1', date: new Date(2023, 5, 15) },
    { name: 'Alice Brown', email: 'alice@example.com', phone: '+1555666777', botId: '2', date: new Date(2023, 5, 18) },
    { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1234567890', botId: '2', date: new Date(2023, 5, 17) },
    { name: 'Robert Smith', email: 'robert@example.com', phone: '+1987654321', botId: '1', date: new Date(2023, 5, 18) },
    { name: 'Emily Davis', email: 'emily@example.com', phone: '+1122334455', botId: '1', date: new Date(2023, 5, 19) }
  ]);
  
  const analytics = ref({
    totalConversations: 245,
    leadsCount: 73,
    conversionRate: 29.8,
    popularQuestions: [
      { text: 'What are your pricing plans?', count: 42 },
      { text: 'How do I contact support?', count: 38 },
      { text: 'Do you offer refunds?', count: 27 },
      { text: 'What payment methods do you accept?', count: 21 },
      { text: 'How long is the free trial?', count: 18 }
    ]
  });
  
  // Computed properties
  const filteredBots = computed(() => {
    let result = bots.value;
    
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(bot => 
        bot.name.toLowerCase().includes(query) || 
        bot.description.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter.value !== 'all') {
      const isActive = statusFilter.value === 'active';
      result = result.filter(bot => bot.active === isActive);
    }
    
    return result;
  });
  
  const filteredBotsForConversation = computed(() => {
    if (!botSearchQuery.value) return bots.value;
    const query = botSearchQuery.value.toLowerCase();
    return bots.value.filter(bot => 
      bot.name.toLowerCase().includes(query) || 
      bot.description.toLowerCase().includes(query)
    );
  });
  
  const filteredConversationsForBot = computed(() => {
    if (!selectedBotId.value) return [];
    
    let result = conversations.value.filter(c => c.botId === selectedBotId.value);
    
    if (conversationSearchQuery.value) {
      const query = conversationSearchQuery.value.toLowerCase();
      result = result.filter(conversation => 
        conversation.visitorId.includes(query) || 
        conversation.messages.some(m => m.text.toLowerCase().includes(query))
      );
    }
    
    return result;
  });
  
  const filteredConversations = computed(() => {
    if (!conversationSearchQuery.value) return conversations.value;
    const query = conversationSearchQuery.value.toLowerCase();
    return conversations.value.filter(conversation => 
      conversation.visitorId.includes(query) || 
      conversation.messages.some(m => m.text.toLowerCase().includes(query))
    );
  });
  
  const filteredLeads = computed(() => {
    if (!leadSearchQuery.value) return leads.value;
    const query = leadSearchQuery.value.toLowerCase();
    return leads.value.filter(lead => 
      lead.name.toLowerCase().includes(query) || 
      lead.email.toLowerCase().includes(query) || 
      lead.phone.includes(query)
    );
  });
  
  // Check if all bots are selected
  const isAllSelected = computed(() => {
    return filteredBots.value.length > 0 && selectedBots.value.length === filteredBots.value.length;
  });
  
  // Check if some bots are selected
  const isIndeterminate = computed(() => {
    return selectedBots.value.length > 0 && selectedBots.value.length < filteredBots.value.length;
  });
  
  // Methods
  const openAddBotSidebar = () => {
    botForm.value = {
      id: Date.now().toString(),
      name: '',
      description: '',
      welcomeMessage: 'Hello! How can I help you today?',
      flow: [
        {
          message: 'Hello! How can I help you today?',
          type: 'text',
          nextNode: 'end'
        }
      ]
    };
    editingBot.value = null;
    showEditSidebar.value = true;
    closeOtherSidebars('edit');
  };
  
  const editBot = (bot) => {
    botForm.value = {
      id: bot.id,
      name: bot.name,
      description: bot.description,
      welcomeMessage: bot.welcomeMessage,
      flow: JSON.parse(JSON.stringify(bot.flow)) // Deep copy
    };
    editingBot.value = bot;
    showEditSidebar.value = true;
    closeOtherSidebars('edit');
  };
  
  const saveBot = () => {
    if (editingBot.value) {
      // Update existing bot
      const index = bots.value.findIndex(b => b.id === botForm.value.id);
      if (index !== -1) {
        bots.value[index] = {
          ...bots.value[index],
          name: botForm.value.name,
          description: botForm.value.description,
          welcomeMessage: botForm.value.welcomeMessage,
          flow: JSON.parse(JSON.stringify(botForm.value.flow))
        };
      }
    } else {
      // Create new bot
      bots.value.push({
        id: botForm.value.id,
        name: botForm.value.name,
        description: botForm.value.description,
        welcomeMessage: botForm.value.welcomeMessage,
        flow: JSON.parse(JSON.stringify(botForm.value.flow)),
        active: false,
        conversationCount: 0,
        leadCount: 0
      });
    }
    closeEditSidebar();
  };
  
  const deleteBot = (botId) => {
    if (confirm('Are you sure you want to delete this bot?')) {
      bots.value = bots.value.filter(b => b.id !== botId);
      actionMenuOpen.value = null;
    }
  };
  
  const toggleBotStatus = (bot) => {
    bot.active = !bot.active;
  };
  
  const addNode = () => {
    botForm.value.flow.push({
      message: '',
      type: 'text',
      nextNode: 'end'
    });
  };
  
  const removeNode = (index) => {
    if (botForm.value.flow.length > 1) {
      botForm.value.flow.splice(index, 1);
      
      // Update nextNode references
      botForm.value.flow.forEach(node => {
        if (node.type === 'conditional') {
          if (node.condition.nextNodeTrue > index) {
            node.condition.nextNodeTrue--;
          } else if (node.condition.nextNodeTrue === index) {
            node.condition.nextNodeTrue = 'end';
          }
          
          if (node.condition.nextNodeFalse > index) {
            node.condition.nextNodeFalse--;
          } else if (node.condition.nextNodeFalse === index) {
            node.condition.nextNodeFalse = 'end';
          }
        } else {
          if (node.nextNode > index) {
            node.nextNode--;
          } else if (node.nextNode === index) {
            node.nextNode = 'end';
          }
        }
      });
    }
  };
  
  const selectBotForConversation = (botId) => {
    selectedBotId.value = botId;
    selectedConversationId.value = null;
    selectedConversationForChat.value = null;
  };
  
  const selectConversationForChat = (conversationId) => {
    selectedConversationId.value = conversationId;
    const conversation = conversations.value.find(c => c.id === conversationId);
    if (conversation) {
      selectedConversationForChat.value = conversation;
      replyMessage.value = '';
      
      // Scroll to bottom of messages on next tick
      nextTick(() => {
        if (chatMessagesContainer.value) {
          chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight;
        }
      });
    }
  };
  
  const sendReplyToChat = () => {
    if (!replyMessage.value.trim() || !selectedConversationForChat.value) return;
    
    // Add bot reply to conversation
    selectedConversationForChat.value.messages.push({
      sender: 'bot',
      text: replyMessage.value.trim()
    });
    
    // Clear reply input
    replyMessage.value = '';
    
    // Scroll to bottom of messages
    nextTick(() => {
      if (chatMessagesContainer.value) {
        chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight;
      }
    });
  };
  
  const markChatAsCompleted = () => {
    if (selectedConversationForChat.value) {
      selectedConversationForChat.value.completed = true;
    }
  };
  
  const viewBotConversations = (botId) => {
    activeTab.value = 'conversations';
    selectedBotId.value = botId;
    selectedConversationId.value = null;
    selectedConversationForChat.value = null;
    actionMenuOpen.value = null;
  };
  
  const openIntegrationSidebarWithBot = (botId) => {
    selectedBotForIntegration.value = botId;
    showIntegrationSidebar.value = true;
    closeOtherSidebars('integration');
    actionMenuOpen.value = null;
  };
  
  const openLeadsSidebar = () => {
    showLeadsSidebar.value = true;
    closeOtherSidebars('leads');
  };
  
  
   const generateIntegrationScript = (botId) => {
    const bot = bots.value.find(b => b.id === botId);
    if (!bot) return '';
    
    return `<!-- ${bot.name} Chatbot Integration -->
  <script>
    (function() {
      var script = document.createElement('script');
      script.src = 'https://your-chatbot-domain.com/chatbot.js';
      script.async = true;
      script.onload = function() {
        initChatbot({
          botId: '${botId}',
          position: '${integrationOptions.value.position}',
          themeColor: '${integrationOptions.value.themeColor}',
          autoOpen: ${integrationOptions.value.autoOpen},
          welcomeMessage: '${bot.welcomeMessage}'
        });
      };
      document.head.appendChild(script);
    })();
  <\/script>`;
  };
  
  const copyIntegrationScript = () => {
    const script = generateIntegrationScript(selectedBotForIntegration.value);
    navigator.clipboard.writeText(script)
      .then(() => {
        alert('Integration script copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  const getBotName = (botId) => {
    const bot = bots.value.find(b => b.id === botId);
    return bot ? bot.name : 'Unknown Bot';
  };
  
  const getSelectedBot = (botId) => {
    return bots.value.find(b => b.id === botId);
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatFieldName = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1);
  };
  
  const closeEditSidebar = () => {
    showEditSidebar.value = false;
  };
  
  const closeAllSidebars = () => {
    showEditSidebar.value = false;
    showIntegrationSidebar.value = false;
    showLeadsSidebar.value = false;
  };
  
  const closeOtherSidebars = (current) => {
    if (current !== 'edit') showEditSidebar.value = false;
    if (current !== 'integration') showIntegrationSidebar.value = false;
    if (current !== 'leads') showLeadsSidebar.value = false;
  };
  
  // Toggle bot selection
  const toggleBotSelection = (id) => {
    if (selectedBots.value.includes(id)) {
      selectedBots.value = selectedBots.value.filter(botId => botId !== id);
    } else {
      selectedBots.value.push(id);
    }
  };
  
  // Toggle select all bots
  const toggleSelectAll = () => {
    if (selectedBots.value.length === filteredBots.value.length) {
      selectedBots.value = [];
    } else {
      selectedBots.value = filteredBots.value.map(bot => bot.id);
    }
  };
  
  // Toggle action menu
  const toggleActionMenu = (id) => {
    if (actionMenuOpen.value === id) {
      actionMenuOpen.value = null;
    } else {
      actionMenuOpen.value = id;
    }
  };
  
  // Watch for tab changes to reset conversation view
  watch(activeTab, (newTab) => {
    if (newTab === 'conversations') {
      // If no bot is selected, select the first active bot
      if (!selectedBotId.value && bots.value.length > 0) {
        const activeBot = bots.value.find(b => b.active);
        if (activeBot) {
          selectedBotId.value = activeBot.id;
        } else {
          selectedBotId.value = bots.value[0].id;
        }
      }
    }
  });
  
  // Lifecycle hooks
  onMounted(() => {
    // Initialize any required data or fetch from API
  });
  </script>
  
  <style>
  /* Additional styles can be added here if needed */
  </style>