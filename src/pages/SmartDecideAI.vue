<template>
    <div class="flex h-full flex-col">
      <!-- Page Header -->
      <header class="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="flex h-14 items-center gap-4 px-4 sm:px-6">
          <h1 class="text-lg font-semibold">AI Box - Sujets par Canal</h1>
          <div class="ml-auto flex items-center gap-2">
            <div class="relative">
              <SearchIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                v-model="searchQuery"
                placeholder="Rechercher des sujets..."
                class="h-9 w-[180px] rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-[240px]"
              />
            </div>
            <button 
              @click="refreshData"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <RefreshCwIcon class="mr-2 h-4 w-4" />
              Actualiser
            </button>
          </div>
        </div>
      </header>
  
      <!-- Main Content -->
      <div class="flex-1 overflow-auto p-4 sm:p-6">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-card rounded-lg shadow border border-border p-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-muted-foreground">Total Sujets</h3>
              <BarChart2Icon class="h-5 w-5 text-muted-foreground" />
            </div>
            <p class="mt-2 text-2xl font-semibold">{{ filteredTopics.length }}</p>
          </div>
          
          <div class="bg-card rounded-lg shadow border border-border p-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-muted-foreground">Conversations</h3>
              <MessagesSquareIcon class="h-5 w-5 text-muted-foreground" />
            </div>
            <p class="mt-2 text-2xl font-semibold">{{ totalConversations }}</p>
          </div>
          
          <div class="bg-card rounded-lg shadow border border-border p-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-muted-foreground">Produits</h3>
              <PackageIcon class="h-5 w-5 text-muted-foreground" />
            </div>
            <p class="mt-2 text-2xl font-semibold">{{ uniqueProducts.length }}</p>
          </div>
          
          <div class="bg-card rounded-lg shadow border border-border p-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-muted-foreground">Expéditeurs</h3>
              <UsersIcon class="h-5 w-5 text-muted-foreground" />
            </div>
            <p class="mt-2 text-2xl font-semibold">{{ uniqueSenders.length }}</p>
          </div>
        </div>
        
        <!-- Topics Table -->
        <div class="rounded-md border">
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead class="bg-muted/50">
                <tr>
                  <th class="px-4 py-3 text-left">
                    <span class="text-sm font-medium text-muted-foreground">Sujet</span>
                  </th>
                  <th class="px-4 py-3 text-left">
                    <span class="text-sm font-medium text-muted-foreground">Canal</span>
                  </th>
                  <th class="px-4 py-3 text-left">
                    <span class="text-sm font-medium text-muted-foreground">Produit</span>
                  </th>
                  <th class="px-4 py-3 text-left">
                    <span class="text-sm font-medium text-muted-foreground">Expéditeurs</span>
                  </th>
                  <th class="px-4 py-3 text-left">
                    <span class="text-sm font-medium text-muted-foreground">Conversations</span>
                  </th>
                  <th class="px-4 py-3 text-right">
                    <span class="text-sm font-medium text-muted-foreground">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="topic in filteredTopics" :key="topic.id" class="border-b transition-colors hover:bg-muted/50">
                  <td class="px-4 py-3">
                    <div class="font-medium">{{ topic.subject }}</div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': topic.channel === 'whatsapp',
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': topic.channel === 'sms',
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300': topic.channel === 'email'
                      }">
                        <span class="mr-1">
                          <MessageCircleIcon v-if="topic.channel === 'whatsapp'" class="h-3 w-3" />
                          <MessageSquareIcon v-if="topic.channel === 'sms'" class="h-3 w-3" />
                          <MailIcon v-if="topic.channel === 'email'" class="h-3 w-3" />
                        </span>
                        {{ getChannelName(topic.channel) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <PackageIcon class="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{{ topic.product }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <div class="flex -space-x-2 overflow-hidden">
                        <div v-for="(sender, index) in topic.senders.slice(0, 3)" :key="index" class="inline-block h-6 w-6 rounded-full bg-primary/10 ring-2 ring-background flex items-center justify-center text-primary text-xs">
                          {{ sender.name.charAt(0) }}
                        </div>
                      </div>
                      <span v-if="topic.senders.length > 3" class="ml-1 text-xs text-muted-foreground">
                        +{{ topic.senders.length - 3 }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <MessageSquareIcon class="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{{ topic.conversations.length }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button 
                      @click="openTopicSidebar(topic)"
                      class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                    >
                      <ListIcon class="h-3.5 w-3.5 mr-1" />
                      Voir conversations
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredTopics.length === 0" class="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10 mt-6">
          <SearchXIcon class="h-12 w-12 text-muted-foreground mb-4" />
          <h3 class="text-lg font-medium mb-1">Aucun sujet trouvé</h3>
          <p class="text-sm text-muted-foreground">
            {{ searchQuery ? 'Essayez d\'ajuster votre recherche.' : 'Aucun sujet disponible.' }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Topic Conversations Sidebar -->
    <div 
      class="fixed inset-y-0 right-0 z-20 flex w-full md:w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out"
      :class="showTopicSidebar ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex h-14 items-center justify-between border-b px-4">
        <div class="flex items-center">
          <h2 class="text-lg font-semibold">{{ selectedTopic ? selectedTopic.subject : 'Conversations' }}</h2>
          <span v-if="selectedTopic" class="ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="{
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': selectedTopic.channel === 'whatsapp',
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': selectedTopic.channel === 'sms',
            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300': selectedTopic.channel === 'email'
          }">
            {{ getChannelName(selectedTopic.channel) }}
          </span>
        </div>
        <button 
          @click="closeTopicSidebar" 
          class="rounded-full p-1 hover:bg-muted"
        >
          <XIcon class="h-5 w-5" />
        </button>
      </div>
      
      <!-- Topic Info -->
      <div v-if="selectedTopic" class="border-b p-4">
        <div class="flex items-center gap-3 mb-2">
          <div class="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <PackageIcon class="h-5 w-5" />
          </div>
          <div>
            <div class="font-medium">{{ selectedTopic.product }}</div>
            <div class="text-xs text-muted-foreground">ID: {{ selectedTopic.productId }}</div>
          </div>
        </div>
        <div class="text-sm mt-2">
          <p>{{ selectedTopic.productDescription }}</p>
        </div>
      </div>
      
      <!-- Conversations List -->
      <div v-if="selectedTopic" class="flex-1 overflow-auto p-4">
        <h3 class="text-sm font-medium mb-3">Conversations</h3>
        <div class="space-y-4">
          <div v-for="conversation in selectedTopic.conversations" :key="conversation.id" class="border rounded-md overflow-hidden">
            <!-- Conversation Header -->
            <div class="bg-muted/30 p-3 border-b flex justify-between items-center">
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UserIcon class="h-4 w-4" />
                </div>
                <div>
                  <div class="font-medium text-sm">{{ conversation.sender }}</div>
                  <div class="text-xs text-muted-foreground">{{ formatDate(conversation.date) }}</div>
                </div>
              </div>
              <span class="text-xs px-2 py-1 rounded-full bg-muted">
                {{ conversation.messageCount }} message{{ conversation.messageCount > 1 ? 's' : '' }}
              </span>
            </div>
            
            <!-- Conversation Preview -->
            <div class="p-3 border-b">
              <p class="text-sm">{{ conversation.preview }}</p>
            </div>
            
            <!-- Conversation Actions -->
            <div class="p-3 flex justify-between items-center">
              <button 
                @click="openChatDetails(conversation)"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
              >
                <MessageSquareIcon class="h-3.5 w-3.5 mr-1" />
                Voir détails
              </button>
              <button 
                @click="openReplyForm(conversation)"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3"
              >
                <ReplyIcon class="h-3.5 w-3.5 mr-1" />
                Répondre
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Chat Details Sidebar -->
    <div 
      class="fixed inset-y-0 right-0 z-30 flex w-full md:w-1/2 flex-col border-l bg-background shadow-lg transition-transform duration-300 ease-in-out"
      :class="showChatDetailsSidebar ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex h-14 items-center justify-between border-b px-4">
        <div class="flex items-center">
          <button 
            @click="closeChatDetails" 
            class="mr-2 rounded-full p-1 hover:bg-muted"
          >
            <ArrowLeftIcon class="h-5 w-5" />
          </button>
          <h2 class="text-lg font-semibold">Conversation</h2>
        </div>
        <button 
          @click="closeChatDetails" 
          class="rounded-full p-1 hover:bg-muted"
        >
          <XIcon class="h-5 w-5" />
        </button>
      </div>
      
      <!-- Chat Details Content -->
      <div v-if="selectedConversation" class="flex-1 overflow-auto">
        <!-- Sender Info -->
        <div class="border-b p-4">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserIcon class="h-5 w-5" />
            </div>
            <div>
              <div class="font-medium">{{ selectedConversation.sender }}</div>
              <div class="text-xs text-muted-foreground">
                {{ getSenderContact(selectedConversation.sender) }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Messages -->
        <div class="p-4 space-y-4">
          <!-- Sample messages - in a real app, these would come from the API -->
          <div class="flex">
            <div class="max-w-[80%] bg-muted p-3 rounded-lg text-sm">
              {{ selectedConversation.preview }}
            </div>
          </div>
          <div class="flex justify-end">
            <div class="max-w-[80%] bg-primary/10 p-3 rounded-lg text-sm">
              Merci pour votre message. Je vais examiner votre demande.
            </div>
          </div>
          <div class="flex">
            <div class="max-w-[80%] bg-muted p-3 rounded-lg text-sm">
              D'accord, j'attends votre réponse. Merci.
            </div>
          </div>
        </div>
      </div>
      
      <!-- Reply Form -->
      <div class="border-t p-4">
        <div class="flex flex-col gap-2">
          <textarea 
            v-model="replyMessage" 
            rows="3" 
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            placeholder="Tapez votre réponse..."
          ></textarea>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <button class="rounded-md p-1.5 hover:bg-muted text-muted-foreground">
                <PaperclipIcon class="h-4 w-4" />
              </button>
              <button class="rounded-md p-1.5 hover:bg-muted text-muted-foreground">
                <SmileIcon class="h-4 w-4" />
              </button>
            </div>
            <button 
              @click="sendReply"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              :disabled="!replyMessage.trim()"
            >
              <SendIcon class="mr-2 h-4 w-4" />
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Overlay when sidebar is open -->
    <div 
      v-if="showTopicSidebar || showChatDetailsSidebar" 
      class="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm"
      @click="closeAllSidebars"
    ></div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import {
    ArrowLeftIcon,
    BarChart2Icon,
    ListIcon,
    MailIcon,
    MessageCircleIcon,
    MessageSquareIcon,
    MessagesSquareIcon,
    PackageIcon,
    PaperclipIcon,
    RefreshCwIcon,
    ReplyIcon,
    SearchIcon,
    SearchXIcon,
    SendIcon,
    SmileIcon,
    UserIcon,
    UsersIcon,
    XIcon
  } from 'lucide-vue-next';
  
  // State
  const searchQuery = ref('');
  const showTopicSidebar = ref(false);
  const showChatDetailsSidebar = ref(false);
  const selectedTopic = ref(null);
  const selectedConversation = ref(null);
  const replyMessage = ref('');
  
  // Sample data
  const topics = ref([
    {
      id: '1',
      subject: 'Problème de connexion à l\'application',
      channel: 'whatsapp',
      product: 'Application Mobile',
      productId: 'APP-001',
      productDescription: 'Application mobile pour la gestion des comptes clients et le suivi des commandes.',
      senders: [
        { name: 'Jean Dupont', contact: '+33 6 12 34 56 78' },
        { name: 'Marie Martin', contact: '+33 6 98 76 54 32' }
      ],
      conversations: [
        { 
          id: '101',
          sender: 'Jean Dupont',
          date: new Date(2023, 5, 15, 10, 30),
          messageCount: 5,
          preview: 'Bonjour, je n\'arrive pas à me connecter à l\'application. J\'ai essayé de réinitialiser mon mot de passe mais je ne reçois pas l\'email de confirmation.'
        },
        { 
          id: '102',
          sender: 'Marie Martin',
          date: new Date(2023, 5, 16, 14, 45),
          messageCount: 3,
          preview: 'Bonjour, l\'application affiche une erreur de connexion depuis ce matin. Est-ce qu\'il y a une maintenance en cours ?'
        }
      ]
    },
    {
      id: '2',
      subject: 'Question sur la facturation',
      channel: 'email',
      product: 'Service Comptabilité',
      productId: 'COMPT-002',
      productDescription: 'Service de gestion de la comptabilité et de la facturation pour les clients professionnels.',
      senders: [
        { name: 'Sophie Bernard', contact: 'sophie.bernard@example.com' }
      ],
      conversations: [
        { 
          id: '201',
          sender: 'Sophie Bernard',
          date: new Date(2023, 5, 17, 9, 15),
          messageCount: 2,
          preview: 'Bonjour, je souhaiterais obtenir des précisions concernant ma dernière facture. Le montant semble incorrect par rapport à mon abonnement.'
        }
      ]
    },
    {
      id: '3',
      subject: 'Demande de remboursement',
      channel: 'sms',
      product: 'Service Client',
      productId: 'SC-003',
      productDescription: 'Service client pour la gestion des demandes de remboursement et des réclamations.',
      senders: [
        { name: 'Pierre Durand', contact: '+33 7 11 22 33 44' },
        { name: 'Lucie Petit', contact: '+33 6 55 66 77 88' },
        { name: 'Thomas Leroy', contact: '+33 6 99 88 77 66' }
      ],
      conversations: [
        { 
          id: '301',
          sender: 'Pierre Durand',
          date: new Date(2023, 5, 18, 11, 20),
          messageCount: 4,
          preview: 'Bonjour, j\'ai été débité deux fois pour mon abonnement ce mois-ci. Je souhaiterais être remboursé du montant en trop.'
        },
        { 
          id: '302',
          sender: 'Lucie Petit',
          date: new Date(2023, 5, 19, 16, 30),
          messageCount: 2,
          preview: 'Bonjour, j\'ai annulé mon abonnement la semaine dernière mais j\'ai quand même été prélevée. Comment puis-je obtenir un remboursement ?'
        },
        { 
          id: '303',
          sender: 'Thomas Leroy',
          date: new Date(2023, 5, 20, 10, 45),
          messageCount: 3,
          preview: 'Bonjour, suite à notre conversation téléphonique, je vous confirme ma demande de remboursement pour le service non utilisé.'
        }
      ]
    },
    {
      id: '4',
      subject: 'Problème de livraison',
      channel: 'whatsapp',
      product: 'Service Livraison',
      productId: 'LIV-004',
      productDescription: 'Service de livraison et de suivi des colis pour les clients particuliers et professionnels.',
      senders: [
        { name: 'Julie Moreau', contact: '+33 6 11 22 33 44' }
      ],
      conversations: [
        { 
          id: '401',
          sender: 'Julie Moreau',
          date: new Date(2023, 5, 21, 15, 10),
          messageCount: 6,
          preview: 'Bonjour, ma commande devait être livrée hier mais je n\'ai toujours rien reçu. Le suivi indique "en cours de livraison" depuis 2 jours.'
        }
      ]
    },
    {
      id: '5',
      subject: 'Demande d\'information sur les tarifs',
      channel: 'email',
      product: 'Service Commercial',
      productId: 'COM-005',
      productDescription: 'Service commercial pour les demandes d\'information sur les produits et les tarifs.',
      senders: [
        { name: 'Antoine Dubois', contact: 'antoine.dubois@example.com' },
        { name: 'Camille Roux', contact: 'camille.roux@example.com' }
      ],
      conversations: [
        { 
          id: '501',
          sender: 'Antoine Dubois',
          date: new Date(2023, 5, 22, 9, 30),
          messageCount: 2,
          preview: 'Bonjour, je souhaiterais connaître vos tarifs pour les entreprises de plus de 50 employés. Pouvez-vous m\'envoyer une documentation ?'
        },
        { 
          id: '502',
          sender: 'Camille Roux',
          date: new Date(2023, 5, 23, 14, 15),
          messageCount: 3,
          preview: 'Bonjour, je suis intéressé par votre offre premium. Existe-t-il des réductions pour un engagement sur 12 mois ?'
        }
      ]
    },
    {
      id: '6',
      subject: 'Problème technique avec le site web',
      channel: 'sms',
      product: 'Site Web',
      productId: 'WEB-006',
      productDescription: 'Site web de l\'entreprise pour la présentation des produits et services et la gestion des commandes en ligne.',
      senders: [
        { name: 'Nicolas Martin', contact: '+33 6 12 34 56 78' }
      ],
      conversations: [
        { 
          id: '601',
          sender: 'Nicolas Martin',
          date: new Date(2023, 5, 24, 16, 45),
          messageCount: 4,
          preview: 'Bonjour, je n\'arrive pas à finaliser ma commande sur votre site. La page de paiement affiche une erreur à chaque fois que je valide mon panier.'
        }
      ]
    }
  ]);
  
  // Computed properties
  const filteredTopics = computed(() => {
    if (!searchQuery.value) return topics.value;
    
    const query = searchQuery.value.toLowerCase();
    return topics.value.filter(topic => 
      topic.subject.toLowerCase().includes(query) || 
      topic.product.toLowerCase().includes(query) ||
      topic.senders.some(sender => sender.name.toLowerCase().includes(query)) ||
      topic.conversations.some(conv => conv.preview.toLowerCase().includes(query))
    );
  });
  
  const totalConversations = computed(() => {
    return filteredTopics.value.reduce((total, topic) => total + topic.conversations.length, 0);
  });
  
  const uniqueProducts = computed(() => {
    const products = filteredTopics.value.map(topic => topic.product);
    return [...new Set(products)];
  });
  
  const uniqueSenders = computed(() => {
    const senders = [];
    filteredTopics.value.forEach(topic => {
      topic.senders.forEach(sender => {
        if (!senders.some(s => s.contact === sender.contact)) {
          senders.push(sender);
        }
      });
    });
    return senders;
  });
  
  // Methods
  const getChannelName = (channel) => {
    switch (channel) {
      case 'whatsapp': return 'WhatsApp';
      case 'sms': return 'SMS';
      case 'email': return 'Email';
      default: return channel;
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getSenderContact = (senderName) => {
    if (!selectedTopic.value) return '';
    
    const sender = selectedTopic.value.senders.find(s => s.name === senderName);
    return sender ? sender.contact : '';
  };
  
  const refreshData = () => {
    // In a real application, this would fetch fresh data from the server
    console.log('Refreshing data...');
  };
  
  const openTopicSidebar = (topic) => {
    selectedTopic.value = topic;
    showTopicSidebar.value = true;
  };
  
  const closeTopicSidebar = () => {
    showTopicSidebar.value = false;
    selectedTopic.value = null;
  };
  
  const openChatDetails = (conversation) => {
    selectedConversation.value = conversation;
    showChatDetailsSidebar.value = true;
  };
  
  const closeChatDetails = () => {
    showChatDetailsSidebar.value = false;
    // Don't reset selectedConversation here to keep the conversation context
    // when returning to the conversations list
  };
  
  const openReplyForm = (conversation) => {
    selectedConversation.value = conversation;
    showChatDetailsSidebar.value = true;
    // Focus on reply textarea
    setTimeout(() => {
      document.querySelector('textarea').focus();
    }, 100);
  };
  
  const sendReply = () => {
    if (!replyMessage.value.trim()) return;
    
    // In a real application, this would send the reply to the server
    console.log('Sending reply:', replyMessage.value);
    
    // Clear the reply message
    replyMessage.value = '';
    
    // Show a success message or update the UI
    alert('Réponse envoyée avec succès!');
  };
  
  const closeAllSidebars = () => {
    showTopicSidebar.value = false;
    showChatDetailsSidebar.value = false;
  };
  
  // Lifecycle hooks
  onMounted(() => {
    // Initialize data or fetch from API
  });
  </script>
  
  <style>
  /* Additional styles can be added here if needed */
  </style>