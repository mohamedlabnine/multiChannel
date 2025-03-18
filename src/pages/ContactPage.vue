<template>
  <div class="flex h-full">
    <!-- Sidebar for adding/editing contacts -->
    <div 
      class="fixed inset-y-0 right-0 z-20 flex w-full md:w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out"
      :class="showSidebar ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex h-14 items-center justify-between border-b px-4">
        <h2 class="text-lg font-semibold">{{ editingContact ? 'Modifier le contact' : 'Ajouter un contact' }}</h2>
        <button 
          @click="closeSidebar" 
          class="rounded-full p-1 hover:bg-muted"
        >
          <XIcon class="h-5 w-5" />
        </button>
      </div>
      
      <!-- Contact Form -->
      <div class="flex-1 overflow-auto p-4">
        <form @submit.prevent="saveContact" class="space-y-6 max-w-3xl mx-auto">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-muted-foreground">Informations de base</h3>
            
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label for="firstName" class="text-sm font-medium">Prénom</label>
                <input 
                  id="firstName" 
                  v-model="contact.firstName" 
                  type="text" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Prénom"
                  required
                />
              </div>
              
              <div class="space-y-2">
                <label for="lastName" class="text-sm font-medium">Nom</label>
                <input 
                  id="lastName" 
                  v-model="contact.lastName" 
                  type="text" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Nom"
                  required
                />
              </div>
            </div>
            
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium">Email</label>
              <input 
                id="email" 
                v-model="contact.email" 
                type="email" 
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="email@exemple.com"
                required
              />
            </div>
            
            <div class="space-y-2">
              <label for="phone" class="text-sm font-medium">Téléphone</label>
              <input 
                id="phone" 
                v-model="contact.phone" 
                type="tel" 
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            
            <div class="space-y-2">
              <label for="status" class="text-sm font-medium">Statut</label>
              <select 
                id="status" 
                v-model="contact.status" 
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="unsubscribed">Désabonné</option>
                <option value="bounced">Rebond</option>
              </select>
            </div>
          </div>
          
          <!-- Additional Information -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-muted-foreground">Informations supplémentaires</h3>
            
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <label for="company" class="text-sm font-medium">Entreprise</label>
                <input 
                  id="company" 
                  v-model="contact.company" 
                  type="text" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Nom de l'entreprise"
                />
              </div>
              
              <div class="space-y-2">
                <label for="jobTitle" class="text-sm font-medium">Poste</label>
                <input 
                  id="jobTitle" 
                  v-model="contact.jobTitle" 
                  type="text" 
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Titre du poste"
                />
              </div>
            </div>
            
            <div class="space-y-2">
              <label for="group" class="text-sm font-medium">Groupe</label>
              <select 
                id="group" 
                v-model="contact.group" 
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Aucun groupe</option>
                <option value="customers">Clients</option>
                <option value="prospects">Prospects</option>
                <option value="partners">Partenaires</option>
                <option value="suppliers">Fournisseurs</option>
              </select>
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-medium">Tags</label>
              <div class="flex flex-wrap gap-2 p-2 border rounded-md bg-background">
                <div v-for="(tag, index) in contact.tags" :key="index" class="flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs">
                  <span>{{ tag }}</span>
                  <button type="button" @click="removeTag(index)" class="rounded-full hover:bg-accent-foreground/10">
                    <XIcon class="h-3 w-3" />
                  </button>
                </div>
                
                <div class="flex items-center">
                  <input 
                    v-model="newTag" 
                    @keydown.enter.prevent="addTag"
                    type="text" 
                    class="w-24 border-0 bg-transparent text-sm focus:outline-none focus:ring-0"
                    placeholder="Ajouter un tag..."
                  />
                  <button 
                    type="button" 
                    @click="addTag" 
                    class="ml-1 rounded-full p-1 hover:bg-accent"
                  >
                    <PlusIcon class="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            
            <div class="space-y-2">
              <label for="notes" class="text-sm font-medium">Notes</label>
              <textarea 
                id="notes" 
                v-model="contact.notes" 
                rows="3" 
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Notes supplémentaires sur ce contact..."
              ></textarea>
            </div>
          </div>
          
          <!-- Avatar Upload -->
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-muted-foreground">Photo de profil</h3>
            
            <div class="flex items-center gap-4">
              <div class="h-16 w-16 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar preview" class="h-full w-full object-cover" />
                <UserIcon v-else class="h-8 w-8 text-muted-foreground/50" />
              </div>
              
              <div class="space-y-2">
                <label for="avatar" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer">
                  <UploadIcon class="mr-2 h-4 w-4" />
                  Choisir une image
                </label>
                <input 
                  id="avatar" 
                  type="file" 
                  accept="image/*" 
                  @change="handleAvatarChange" 
                  class="hidden"
                />
                <p class="text-xs text-muted-foreground">JPG, PNG ou GIF. 1MB max.</p>
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
            @click="closeSidebar" 
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            Annuler
          </button>
          <button 
            type="button"
            @click="saveContact" 
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
          >
            <SaveIcon class="mr-2 h-4 w-4" />
            {{ editingContact ? 'Mettre à jour' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Overlay when sidebar is open -->
    <div 
      v-if="showSidebar" 
      class="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm"
      @click="closeSidebar"
    ></div>

    <!-- Main Content -->
    <div class="flex h-full w-full flex-col">
      <!-- Page Header -->
      <header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="flex h-14 items-center gap-4 px-4 sm:px-6">
          <h1 class="text-lg font-semibold">Contacts</h1>
          <div class="ml-auto flex items-center gap-2">
            <div class="relative">
              <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                  type="search"
                  v-model="searchQuery"
                  placeholder="Search contacts..."
                  class="h-9 w-[180px] rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-[240px]"
              />
            </div>
            <button 
              @click="openAddContactSidebar"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <PlusIcon class="mr-2 h-4 w-4" />
              New Contact
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
              <TagIcon class="mr-2 h-4 w-4" />
              Add Tags
            </button>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
              <UsersIcon class="mr-2 h-4 w-4" />
              Add to Group
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
                <option value="all">All Contacts</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="unsubscribed">Unsubscribed</option>
                <option value="bounced">Bounced</option>
              </select>
            </div>
            <div class="inline-flex items-center rounded-md border border-input bg-background px-3 h-9">
              <span class="text-sm text-muted-foreground mr-2">Group:</span>
              <select v-model="groupFilter" class="h-full border-0 bg-transparent text-sm focus:outline-none focus:ring-0">
                <option value="all">All Groups</option>
                <option value="customers">Customers</option>
                <option value="prospects">Prospects</option>
                <option value="partners">Partners</option>
                <option value="suppliers">Suppliers</option>
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
          <template v-for="(contact, index) in filteredContacts" :key="contact.id">
            <!-- Main Row -->
            <tr
                class="group border-b transition-colors hover:bg-muted/50"
                :class="{ 'bg-muted/30': selectedRows.includes(contact.id) }"
            >
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <input
                      type="checkbox"
                      :checked="selectedRows.includes(contact.id)"
                      @change="toggleRowSelection(contact.id)"
                      class="h-4 w-4 rounded border-input bg-background"
                  />
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <button
                      class="flex h-5 w-5 items-center justify-center rounded-full border border-input bg-background"
                      @click="toggleExpandRow(contact.id)"
                  >
                    <ChevronRightIcon
                        class="h-3 w-3 transition-transform"
                        :class="{ 'rotate-90': expandedRows.includes(contact.id) }"
                    />
                  </button>
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                      <img v-if="contact.avatar" :src="contact.avatar" alt="Contact avatar" class="h-full w-full object-cover" />
                      <UserIcon v-else class="h-5 w-5 text-muted-foreground/50" />
                    </div>
                    <div>
                      <div class="font-medium">{{ contact.name }}</div>
                      <div class="text-xs text-muted-foreground truncate max-w-[200px]">{{ contact.email }}</div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                  <span
                      class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                      :class="{
                      'border-transparent bg-emerald-500/10 text-emerald-500': contact.status === 'active',
                      'border-transparent bg-slate-500/10 text-slate-500': contact.status === 'inactive',
                      'border-transparent bg-amber-500/10 text-amber-500': contact.status === 'unsubscribed',
                      'border-transparent bg-red-500/10 text-red-500': contact.status === 'bounced',
                    }"
                  >
                    {{ contact.status.charAt(0).toUpperCase() + contact.status.slice(1) }}
                  </span>
              </td>
              <td class="px-4 py-3 hidden sm:table-cell">
                <div class="flex items-center gap-1">
                  <CalendarIcon class="h-3 w-3 text-muted-foreground" />
                  <span>{{ contact.createdDate }}</span>
                </div>
              </td>
              <td class="px-4 py-3 hidden md:table-cell">
                <div class="flex flex-wrap gap-1">
                  <span v-for="(tag, tagIndex) in contact.tags" :key="tagIndex" 
                        class="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs">
                    {{ tag }}
                  </span>
                  <span v-if="contact.tags.length === 0" class="text-xs text-muted-foreground">No tags</span>
                </div>
              </td>
              <td class="px-4 py-3 hidden md:table-cell">{{ contact.group || 'None' }}</td>
              <td class="px-4 py-3 hidden lg:table-cell">
                <div v-if="contact.lastActivity" class="text-sm">
                  {{ contact.lastActivity }}
                </div>
                <div v-else class="text-sm text-muted-foreground">Never</div>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                      @click="editContact(contact)"
                  >
                    Edit
                  </button>
                  <div class="relative">
                    <button
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
                        @click="toggleActionMenu(contact.id)"
                    >
                      <MoreHorizontalIcon class="h-4 w-4" />
                    </button>

                    <!-- Action Menu Dropdown -->
                    <div
                        v-if="actionMenuOpen === contact.id"
                        class="absolute right-0 top-full z-50 mt-1 w-48 rounded-md border bg-card p-1 shadow-md"
                    >
                      <button class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
                        <MailIcon class="h-4 w-4" />
                        <span>Send Email</span>
                      </button>
                      <button class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
                        <TagIcon class="h-4 w-4" />
                        <span>Manage Tags</span>
                      </button>
                      <button class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent">
                        <UsersIcon class="h-4 w-4" />
                        <span>Add to Group</span>
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
            <tr v-if="expandedRows.includes(contact.id)" class="border-b bg-muted/20">
              <td class="py-3"></td>
              <td colspan="100" class="px-4 py-3">
                <div class="rounded-md border bg-card p-4">
                  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <!-- Contact Details -->
                    <div>
                      <h4 class="mb-2 text-sm font-medium">Contact Details</h4>
                      <dl class="grid grid-cols-[100px_1fr] gap-1 text-sm">
                        <dt class="text-muted-foreground">Full Name:</dt>
                        <dd>{{ contact.name }}</dd>
                        <dt class="text-muted-foreground">Email:</dt>
                        <dd>{{ contact.email }}</dd>
                        <dt class="text-muted-foreground">Phone:</dt>
                        <dd>{{ contact.phone || 'Not provided' }}</dd>
                        <dt class="text-muted-foreground">Created:</dt>
                        <dd>{{ contact.createdDate }}</dd>
                        <dt class="text-muted-foreground">Status:</dt>
                        <dd>
                          <span
                              class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
                              :class="{
                              'border-transparent bg-emerald-500/10 text-emerald-500': contact.status === 'active',
                              'border-transparent bg-slate-500/10 text-slate-500': contact.status === 'inactive',
                              'border-transparent bg-amber-500/10 text-amber-500': contact.status === 'unsubscribed',
                              'border-transparent bg-red-500/10 text-red-500': contact.status === 'bounced',
                            }"
                          >
                            {{ contact.status.charAt(0).toUpperCase() + contact.status.slice(1) }}
                          </span>
                        </dd>
                      </dl>
                    </div>

                    <!-- Additional Information -->
                    <div>
                      <h4 class="mb-2 text-sm font-medium">Additional Information</h4>
                      <dl class="grid grid-cols-[100px_1fr] gap-1 text-sm">
                        <dt class="text-muted-foreground">Company:</dt>
                        <dd>{{ contact.company || 'Not provided' }}</dd>
                        <dt class="text-muted-foreground">Job Title:</dt>
                        <dd>{{ contact.jobTitle || 'Not provided' }}</dd>
                        <dt class="text-muted-foreground">Group:</dt>
                        <dd>{{ contact.group || 'None' }}</dd>
                        <dt class="text-muted-foreground">Tags:</dt>
                        <dd>
                          <div class="flex flex-wrap gap-1">
                            <span v-for="(tag, tagIndex) in contact.tags" :key="tagIndex" 
                                  class="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs">
                              {{ tag }}
                            </span>
                            <span v-if="contact.tags.length === 0" class="text-xs text-muted-foreground">No tags</span>
                          </div>
                        </dd>
                      </dl>
                    </div>

                    <!-- Activity Information -->
                    <div>
                      <h4 class="mb-2 text-sm font-medium">Activity</h4>
                      <dl class="grid grid-cols-[100px_1fr] gap-1 text-sm">
                        <dt class="text-muted-foreground">Last Active:</dt>
                        <dd>{{ contact.lastActivity || 'Never' }}</dd>
                        <dt class="text-muted-foreground">Emails Sent:</dt>
                        <dd>{{ contact.emailsSent || 0 }}</dd>
                        <dt class="text-muted-foreground">Open Rate:</dt>
                        <dd>{{ contact.openRate || 0 }}%</dd>
                        <dt class="text-muted-foreground">Click Rate:</dt>
                        <dd>{{ contact.clickRate || 0 }}%</dd>
                      </dl>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="mt-4 flex items-center gap-2">
                    <button 
                      @click="editContact(contact)"
                      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                    >
                      Edit Contact
                    </button>
                    <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                      <MailIcon class="mr-2 h-4 w-4" />
                      Send Email
                    </button>
                    <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                      <HistoryIcon class="mr-2 h-4 w-4" />
                      View History
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </template>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredContacts.length === 0" class="flex h-[400px] flex-col items-center justify-center p-8 text-center">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <UserIcon class="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 class="mt-4 text-lg font-semibold">No contacts found</h3>
          <p class="mt-2 text-sm text-muted-foreground">
            {{ searchQuery ? 'Try adjusting your search or filters.' : 'Get started by adding your first contact.' }}
          </p>
          <button v-if="!searchQuery" @click="openAddContactSidebar" class="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
            <PlusIcon class="mr-2 h-4 w-4" />
            New Contact
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
            Showing <strong>1-{{ Math.min(filteredContacts.length, 10) }}</strong> of <strong>{{ filteredContacts.length }}</strong> contacts
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
  ArrowLeftIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DownloadIcon,
  FilterIcon,
  HistoryIcon,
  MailIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SaveIcon,
  Search,
  SlidersHorizontalIcon,
  TagIcon,
  TrashIcon,
  UploadIcon,
  UserIcon,
  UsersIcon,
  XIcon
} from 'lucide-vue-next';

// Sidebar state
const showSidebar = ref(false);
const editingContact = ref<any>(null);

// Contact form data
const contact = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  status: 'active',
  company: '',
  jobTitle: '',
  group: '',
  tags: [] as string[],
  notes: ''
});

// Tag management
const newTag = ref('');
const avatarPreview = ref<string | null>(null);

// Table state
const searchQuery = ref('');
const statusFilter = ref('all');
const groupFilter = ref('all');
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
  { key: 'name', label: 'Contact', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdDate', label: 'Created', sortable: true, responsiveHide: 'sm' },
  { key: 'tags', label: 'Tags', sortable: false, responsiveHide: 'md' },
  { key: 'group', label: 'Group', sortable: true, responsiveHide: 'md' },
  { key: 'lastActivity', label: 'Last Activity', sortable: true, responsiveHide: 'lg' },
];

// Visible columns
const visibleColumns = ref(['name', 'status', 'createdDate', 'tags', 'group', 'lastActivity']);

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
  groupFilter.value = 'all';
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
  if (selectedRows.value.length === filteredContacts.value.length) {
    selectedRows.value = [];
  } else {
    selectedRows.value = filteredContacts.value.map(contact => contact.id);
  }
};

// Check if all rows are selected
const isAllSelected = computed(() => {
  return filteredContacts.value.length > 0 && selectedRows.value.length === filteredContacts.value.length;
});

// Check if some rows are selected
const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < filteredContacts.value.length;
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

// Sort contacts
const sortBy = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

// Sidebar functions
const openAddContactSidebar = () => {
  // Reset form
  contact.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'active',
    company: '',
    jobTitle: '',
    group: '',
    tags: [],
    notes: ''
  };
  avatarPreview.value = null;
  editingContact.value = null;
  showSidebar.value = true;
};

const editContact = (contactData: any) => {
  // Split name into first and last name
  const nameParts = contactData.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Populate form with contact data
  contact.value = {
    firstName,
    lastName,
    email: contactData.email,
    phone: contactData.phone || '',
    status: contactData.status,
    company: contactData.company || '',
    jobTitle: contactData.jobTitle || '',
    group: contactData.group || '',
    tags: [...(contactData.tags || [])],
    notes: contactData.notes || ''
  };
  
  avatarPreview.value = contactData.avatar;
  editingContact.value = contactData;
  showSidebar.value = true;
};

const closeSidebar = () => {
  showSidebar.value = false;
};

// Tag management
const addTag = () => {
  if (newTag.value.trim()) {
    contact.value.tags.push(newTag.value.trim());
    newTag.value = '';
  }
};

const removeTag = (index: number) => {
  contact.value.tags.splice(index, 1);
};

// Avatar handling
const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // Check file size (1MB max)
    if (file.size > 1024 * 1024) {
      alert('L\'image est trop volumineuse. Veuillez choisir une image de moins de 1MB.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// Form submission
const saveContact = () => {
  // Combine first and last name
  const fullName = `${contact.value.firstName} ${contact.value.lastName}`;
  
  if (editingContact.value) {
    // Update existing contact
    const index = contacts.value.findIndex(c => c.id === editingContact.value.id);
    if (index !== -1) {
      contacts.value[index] = {
        ...editingContact.value,
        name: fullName,
        email: contact.value.email,
        phone: contact.value.phone,
        status: contact.value.status,
        company: contact.value.company,
        jobTitle: contact.value.jobTitle,
        group: contact.value.group,
        tags: [...contact.value.tags],
        notes: contact.value.notes,
        avatar: avatarPreview.value
      };
    }
  } else {
    // Add new contact
    const newContact = {
      id: contacts.value.length + 1,
      name: fullName,
      email: contact.value.email,
      phone: contact.value.phone,
      status: contact.value.status,
      createdDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      tags: [...contact.value.tags],
      group: contact.value.group,
      lastActivity: null,
      company: contact.value.company,
      jobTitle: contact.value.jobTitle,
      avatar: avatarPreview.value,
      emailsSent: 0,
      openRate: 0,
      clickRate: 0,
      notes: contact.value.notes
    };
    
    contacts.value.unshift(newContact);
  }
  
  // Close sidebar
  closeSidebar();
};

// Filtered contacts based on search and filters
const filteredContacts = computed(() => {
  let result = [...contacts.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        (contact.company && contact.company.toLowerCase().includes(query))
    );
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(contact => contact.status === statusFilter.value);
  }

  // Apply group filter
  if (groupFilter.value !== 'all') {
    result = result.filter(contact => contact.group === groupFilter.value);
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
      case 'createdDate':
        valueA = a.createdDate;
        valueB = b.createdDate;
        break;
      case 'group':
        valueA = a.group || '';
        valueB = b.group || '';
        break;
      case 'lastActivity':
        valueA = a.lastActivity || '';
        valueB = b.lastActivity || '';
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
const totalPages = computed(() => Math.ceil(filteredContacts.value.length / pageSize.value));

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

// Sample contact data
const contacts = ref([
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    createdDate: 'Mar 15, 2024',
    tags: ['Customer', 'VIP'],
    group: 'customers',
    lastActivity: 'Today, 10:23 AM',
    company: 'Acme Inc.',
    jobTitle: 'Marketing Director',
    avatar: '/placeholder.svg?height=200&width=200',
    emailsSent: 12,
    openRate: 75,
    clickRate: 25
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 987-6543',
    status: 'active',
    createdDate: 'Feb 28, 2024',
    tags: ['Prospect', 'Follow-up'],
    group: 'prospects',
    lastActivity: 'Yesterday, 3:45 PM',
    company: 'Global Tech',
    jobTitle: 'CEO',
    avatar: '/placeholder.svg?height=200&width=200',
    emailsSent: 5,
    openRate: 80,
    clickRate: 40
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 456-7890',
    status: 'inactive',
    createdDate: 'Jan 12, 2024',
    tags: ['Customer'],
    group: 'customers',
    lastActivity: 'Mar 10, 2024',
    company: 'Brown Enterprises',
    jobTitle: 'Sales Manager',
    avatar: null,
    emailsSent: 8,
    openRate: 50,
    clickRate: 12
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 789-0123',
    status: 'unsubscribed',
    createdDate: 'Dec 5, 2023',
    tags: ['Former Customer'],
    group: 'customers',
    lastActivity: 'Jan 15, 2024',
    company: 'Davis Design',
    jobTitle: 'Creative Director',
    avatar: '/placeholder.svg?height=200&width=200',
    emailsSent: 15,
    openRate: 20,
    clickRate: 5
  },
  {
    id: 5,
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    createdDate: 'Mar 20, 2024',
    tags: ['Partner', 'Technical'],
    group: 'partners',
    lastActivity: 'Today, 9:15 AM',
    company: 'Wilson Technologies',
    jobTitle: 'CTO',
    avatar: null,
    emailsSent: 3,
    openRate: 100,
    clickRate: 67
  },
  {
    id: 6,
    name: 'Jennifer Lee',
    email: 'jennifer.lee@example.com',
    phone: '+1 (555) 345-6789',
    status: 'bounced',
    createdDate: 'Feb 10, 2024',
    tags: [],
    group: 'prospects',
    lastActivity: null,
    company: 'Lee Consulting',
    jobTitle: 'Consultant',
    avatar: null,
    emailsSent: 2,
    openRate: 0,
    clickRate: 0
  },
  {
    id: 7,
    name: 'David Martinez',
    email: 'david.m@example.com',
    phone: '+1 (555) 567-8901',
    status: 'active',
    createdDate: 'Mar 5, 2024',
    tags: ['Supplier', 'International'],
    group: 'suppliers',
    lastActivity: 'Mar 18, 2024',
    company: 'Martinez Supplies',
    jobTitle: 'Owner',
    avatar: '/placeholder.svg?height=200&width=200',
    emailsSent: 7,
    openRate: 85,
    clickRate: 42
  }
]);
</script>

<style scoped>
/* Add any additional custom styling here */
</style>