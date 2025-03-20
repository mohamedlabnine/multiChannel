<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div class="w-full max-w-md">
        <!-- Card container with shadow and rounded corners -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Tabs for switching between login, register, and forgot password -->
          <div class="flex border-b">
            <button 
              @click="activeTab = 'login'" 
              class="flex-1 py-4 px-6 text-center font-medium transition-colors"
              :class="activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'"
            >
              Login
            </button>
            <button 
              @click="activeTab = 'register'" 
              class="flex-1 py-4 px-6 text-center font-medium transition-colors"
              :class="activeTab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'"
            >
              Register
            </button>
          </div>
  
          <!-- Login Form -->
          <div v-if="activeTab === 'login'" class="p-6">
            <h2 class="text-2xl font-bold text-center mb-6">Welcome Back</h2>
            
            <form @submit.prevent="handleLogin" class="space-y-4">
              <div class="space-y-2">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    v-model="loginForm.email" 
                    type="email" 
                    id="email" 
                    required
                    class="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <p v-if="loginErrors.email" class="text-red-500 text-xs mt-1">{{ loginErrors.email }}</p>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                  <button 
                    type="button" 
                    @click="activeTab = 'forgot'" 
                    class="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </button>
                </div>
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    v-model="loginForm.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    id="password" 
                    required
                    class="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button 
                    type="button" 
                    @click="showPassword = !showPassword" 
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <Eye v-if="!showPassword" class="h-5 w-5" />
                    <EyeOff v-else class="h-5 w-5" />
                  </button>
                </div>
                <p v-if="loginErrors.password" class="text-red-500 text-xs mt-1">{{ loginErrors.password }}</p>
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="loginForm.remember" 
                  id="remember" 
                  type="checkbox" 
                  class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              
              <button 
                type="submit" 
                class="w-full flex justify-center items-center py-2.5 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                :disabled="isLoading"
              >
                <Loader2 v-if="isLoading" class="animate-spin mr-2 h-4 w-4" />
                Sign in
              </button>
            </form>
            
            <div class="mt-6">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div class="mt-6 grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Google
                </button>
                
                <button 
                  type="button" 
                  class="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          </div>
  
          <!-- Register Form -->
          <div v-if="activeTab === 'register'" class="p-6">
            <h2 class="text-2xl font-bold text-center mb-6">Create an Account</h2>
            
            <form @submit.prevent="handleRegister" class="space-y-4">
              <div class="space-y-2">
                <label for="register-name" class="block text-sm font-medium text-gray-700">Full Name</label>
                <div class="relative">
                  <User class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    v-model="registerForm.name" 
                    type="text" 
                    id="register-name" 
                    required
                    class="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <p v-if="registerErrors.name" class="text-red-500 text-xs mt-1">{{ registerErrors.name }}</p>
              </div>
              
              <div class="space-y-2">
                <label for="register-email" class="block text-sm font-medium text-gray-700">Email</label>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    v-model="registerForm.email" 
                    type="email" 
                    id="register-email" 
                    required
                    class="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <p v-if="registerErrors.email" class="text-red-500 text-xs mt-1">{{ registerErrors.email }}</p>
              </div>
              
              <div class="space-y-2">
                <label for="register-password" class="block text-sm font-medium text-gray-700">Password</label>
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    v-model="registerForm.password" 
                    :type="showRegisterPassword ? 'text' : 'password'" 
                    id="register-password" 
                    required
                    class="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Create a password"
                  />
                  <button 
                    type="button" 
                    @click="showRegisterPassword = !showRegisterPassword" 
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <Eye v-if="!showRegisterPassword" class="h-5 w-5" />
                    <EyeOff v-else class="h-5 w-5" />
                  </button>
                </div>
                <p v-if="registerErrors.password" class="text-red-500 text-xs mt-1">{{ registerErrors.password }}</p>
              </div>
              
              <div class="space-y-2">
                <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div class="relative">
                  <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    v-model="registerForm.confirmPassword" 
                    :type="showRegisterPassword ? 'text' : 'password'" 
                    id="confirm-password" 
                    required
                    class="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                </div>
                <p v-if="registerErrors.confirmPassword" class="text-red-500 text-xs mt-1">{{ registerErrors.confirmPassword }}</p>
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="registerForm.terms" 
                  id="terms" 
                  type="checkbox" 
                  required
                  class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label for="terms" class="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" class="text-primary hover:underline">Terms of Service</a> and <a href="#" class="text-primary hover:underline">Privacy Policy</a>
                </label>
              </div>
              <p v-if="registerErrors.terms" class="text-red-500 text-xs mt-1">{{ registerErrors.terms }}</p>
              
              <button 
                type="submit" 
                class="w-full flex justify-center items-center py-2.5 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                :disabled="isLoading"
              >
                <Loader2 v-if="isLoading" class="animate-spin mr-2 h-4 w-4" />
                Create Account
              </button>
            </form>
            
            <p class="mt-4 text-center text-sm text-gray-600">
              Already have an account?
              <button @click="activeTab = 'login'" class="font-medium text-primary hover:text-primary/80">
                Sign in
              </button>
            </p>
          </div>
  
          <!-- Forgot Password Form -->
          <div v-if="activeTab === 'forgot'" class="p-6">
            <h2 class="text-2xl font-bold text-center mb-6">Reset Password</h2>
            <p class="text-center text-gray-600 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <form @submit.prevent="handleForgotPassword" class="space-y-4">
              <div class="space-y-2">
                <label for="forgot-email" class="block text-sm font-medium text-gray-700">Email</label>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    v-model="forgotForm.email" 
                    type="email" 
                    id="forgot-email" 
                    required
                    class="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <p v-if="forgotErrors.email" class="text-red-500 text-xs mt-1">{{ forgotErrors.email }}</p>
              </div>
              
              <button 
                type="submit" 
                class="w-full flex justify-center items-center py-2.5 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                :disabled="isLoading"
              >
                <Loader2 v-if="isLoading" class="animate-spin mr-2 h-4 w-4" />
                Send Reset Link
              </button>
            </form>
            
            <p class="mt-4 text-center text-sm text-gray-600">
              Remember your password?
              <button @click="activeTab = 'login'" class="font-medium text-primary hover:text-primary/80">
                Back to login
              </button>
            </p>
          </div>
        </div>
        
        <!-- Success message after password reset request -->
        <div v-if="resetLinkSent" class="mt-4 p-4 rounded-md bg-green-50 border border-green-200">
          <div class="flex">
            <CheckCircle class="h-5 w-5 text-green-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Reset link sent</h3>
              <div class="mt-2 text-sm text-green-700">
                <p>We've sent a password reset link to your email address. Please check your inbox.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { Mail, Lock, Eye, EyeOff, User, Loader2, CheckCircle } from 'lucide-vue-next'
  
  // Active tab state (login, register, forgot)
  const activeTab = ref('login')
  
  // Loading state
  const isLoading = ref(false)
  
  // Password visibility toggles
  const showPassword = ref(false)
  const showRegisterPassword = ref(false)
  
  // Reset link sent confirmation
  const resetLinkSent = ref(false)
  
  // Login form
  const loginForm = reactive({
    email: '',
    password: '',
    remember: false
  })
  
  const loginErrors = reactive({
    email: '',
    password: ''
  })
  
  // Register form
  const registerForm = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  })
  
  const registerErrors = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: ''
  })
  
  // Forgot password form
  const forgotForm = reactive({
    email: ''
  })
  
  const forgotErrors = reactive({
    email: ''
  })
  
  // Form submission handlers
  const handleLogin = () => {
    // Reset errors
    loginErrors.email = ''
    loginErrors.password = ''
    
    // Validate form
    let isValid = true
    
    if (!loginForm.email) {
      loginErrors.email = 'Email is required'
      isValid = false
    } else if (!isValidEmail(loginForm.email)) {
      loginErrors.email = 'Please enter a valid email address'
      isValid = false
    }
    
    if (!loginForm.password) {
      loginErrors.password = 'Password is required'
      isValid = false
    }
    
    if (!isValid) return
    
    // Submit form
    isLoading.value = true
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login form submitted:', loginForm)
      isLoading.value = false
      // Redirect to dashboard or show success message
    }, 1500)
  }
  
  const handleRegister = () => {
    // Reset errors
    registerErrors.name = ''
    registerErrors.email = ''
    registerErrors.password = ''
    registerErrors.confirmPassword = ''
    registerErrors.terms = ''
    
    // Validate form
    let isValid = true
    
    if (!registerForm.name) {
      registerErrors.name = 'Full name is required'
      isValid = false
    }
    
    if (!registerForm.email) {
      registerErrors.email = 'Email is required'
      isValid = false
    } else if (!isValidEmail(registerForm.email)) {
      registerErrors.email = 'Please enter a valid email address'
      isValid = false
    }
    
    if (!registerForm.password) {
      registerErrors.password = 'Password is required'
      isValid = false
    } else if (registerForm.password.length < 8) {
      registerErrors.password = 'Password must be at least 8 characters'
      isValid = false
    }
    
    if (!registerForm.confirmPassword) {
      registerErrors.confirmPassword = 'Please confirm your password'
      isValid = false
    } else if (registerForm.password !== registerForm.confirmPassword) {
      registerErrors.confirmPassword = 'Passwords do not match'
      isValid = false
    }
    
    if (!registerForm.terms) {
      registerErrors.terms = 'You must agree to the Terms of Service and Privacy Policy'
      isValid = false
    }
    
    if (!isValid) return
    
    // Submit form
    isLoading.value = true
    
    // Simulate API call
    setTimeout(() => {
      console.log('Register form submitted:', registerForm)
      isLoading.value = false
      // Redirect to dashboard or show success message
      activeTab.value = 'login'
    }, 1500)
  }
  
  const handleForgotPassword = () => {
    // Reset errors
    forgotErrors.email = ''
    
    // Validate form
    let isValid = true
    
    if (!forgotForm.email) {
      forgotErrors.email = 'Email is required'
      isValid = false
    } else if (!isValidEmail(forgotForm.email)) {
      forgotErrors.email = 'Please enter a valid email address'
      isValid = false
    }
    
    if (!isValid) return
    
    // Submit form
    isLoading.value = true
    
    // Simulate API call
    setTimeout(() => {
      console.log('Forgot password form submitted:', forgotForm)
      isLoading.value = false
      resetLinkSent.value = true
      
      // Reset form
      forgotForm.email = ''
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        resetLinkSent.value = false
        activeTab.value = 'login'
      }, 5000)
    }, 1500)
  }
  
  // Helper function to validate email
  const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }
  </script>