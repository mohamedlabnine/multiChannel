<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div class="text-center">
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            {{ isLogin ? 'Sign in to your account' : 'Create a new account' }}
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
            <button 
              @click="toggleAuthMode" 
              class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              {{ isLogin ? 'Sign up' : 'Sign in' }}
            </button>
          </p>
        </div>
  
        <transition name="fade" mode="out-in">
          <!-- Login Form -->
          <form v-if="isLogin" @submit.prevent="handleLogin" class="mt-8 space-y-6">
            <div class="rounded-md shadow-sm -space-y-px">
              <div class="space-y-4">
                <label for="login-email" class="sr-only">Email address</label>
                <input 
                  id="login-email" 
                  v-model="loginForm.email" 
                  name="email" 
                  type="email" 
                  autocomplete="email" 
                  required 
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Email address"
                />
              </div>
              <div class="space-y-4">
                <label for="login-password" class="sr-only">Password</label>
                <input 
                  id="login-password" 
                  v-model="loginForm.password" 
                  name="password" 
                  type="password" 
                  autocomplete="current-password" 
                  required 
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Password"
                />
              </div>
            </div>
  
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input 
                  id="remember-me" 
                  v-model="loginForm.rememberMe" 
                  name="remember-me" 
                  type="checkbox" 
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
  
              <div class="text-sm">
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>
  
            <div>
              <button 
                type="submit" 
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </span>
                Sign in
              </button>
            </div>
          </form>
  
          <!-- Register Form -->
          <form v-else @submit.prevent="handleRegister" class="mt-8 space-y-6">
            <div class="rounded-md shadow-sm -space-y-px">
              <div class="space-y-4">
                <label for="register-name" class="sr-only">Full name</label>
                <input 
                  id="register-name" 
                  v-model="registerForm.name" 
                  name="name" 
                  type="text" 
                  autocomplete="name" 
                  required 
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Full name"
                />
              </div>
              <div class="space-y-4">
                <label for="register-email" class="sr-only">Email address</label>
                <input 
                  id="register-email" 
                  v-model="registerForm.email" 
                  name="email" 
                  type="email" 
                  autocomplete="email" 
                  required 
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Email address"
                />
              </div>
              <div class="space-y-4">
                <label for="register-password" class="sr-only">Password</label>
                <input 
                  id="register-password" 
                  v-model="registerForm.password" 
                  name="password" 
                  type="password" 
                  autocomplete="new-password" 
                  required 
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Password"
                />
              </div>
              <div class="space-y-4">
                <label for="register-confirm-password" class="sr-only">Confirm Password</label>
                <input 
                  id="register-confirm-password" 
                  v-model="registerForm.confirmPassword" 
                  name="confirm-password" 
                  type="password" 
                  autocomplete="new-password" 
                  required 
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                  placeholder="Confirm password"
                />
              </div>
            </div>
  
            <div class="flex items-center">
              <input 
                id="terms" 
                v-model="registerForm.agreeToTerms" 
                name="terms" 
                type="checkbox" 
                required 
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="terms" class="ml-2 block text-sm text-gray-900">
                I agree to the <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
              </label>
            </div>
  
            <div>
              <button 
                type="submit" 
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Account
              </button>
            </div>
          </form>

              
        </transition>
        
  
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Or continue with
              </span>
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
    </div>
  </template>
  
  <script>
  export default {
    name: 'AuthPage',
    data() {
      return {
        isLogin: true,
        loginForm: {
          email: '',
          password: '',
          rememberMe: false
        },
        registerForm: {
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false
        }
      }
    },
    methods: {
      toggleAuthMode() {
        this.isLogin = !this.isLogin
      },
      handleLogin() {
        // Here you would implement your login logic
        console.log('Login with:', this.loginForm)
        // Example: this.$store.dispatch('auth/login', this.loginForm)
      },
      handleRegister() {
        // Validate passwords match
        if (this.registerForm.password !== this.registerForm.confirmPassword) {
          alert('Passwords do not match')
          return
        }
        
        // Here you would implement your registration logic
        console.log('Register with:', this.registerForm)
        // Example: this.$store.dispatch('auth/register', this.registerForm)
      }
    }
  }
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  
  