<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon
        v-if="isAuthenticated"
        @click="drawer = !drawer"
        data-automation-id="nav-drawer-toggle"
        aria-label="Open navigation drawer"
      />
      <v-app-bar-title>Classifier</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-if="isAuthenticated"
      v-model="drawer"
      temporary
    >
      <v-list density="compact" nav>
        
        <v-list-subheader>SENTIMENT DOMAIN</v-list-subheader>
        <v-list-item
          to="/sentiments"
          prepend-icon="mdi-view-list"
          title="List sentiments"
          data-automation-id="nav-sentiments-list-link"
        />
        <v-list-item
          to="/sentiments/new"
          prepend-icon="mdi-plus"
          title="New sentiment"
          data-automation-id="nav-sentiments-new-link"
        />

        <v-divider class="my-2" />
        
        <v-list-subheader>RATIOS DOMAIN</v-list-subheader>
        <v-list-item
          to="/ratioss"
          prepend-icon="mdi-view-list"
          title="List ratioss"
          data-automation-id="nav-ratioss-list-link"
        />
        <v-list-item
          to="/ratioss/new"
          prepend-icon="mdi-plus"
          title="New ratios"
          data-automation-id="nav-ratioss-new-link"
        />

        <v-divider class="my-2" />
        
        
        
        <v-list-subheader>POST DOMAIN</v-list-subheader>
        <v-list-item
          to="/posts"
          prepend-icon="mdi-view-list"
          title="List posts"
          data-automation-id="nav-posts-list-link"
        />
        
        <v-list-subheader>COMMENT DOMAIN</v-list-subheader>
        <v-list-item
          to="/comments"
          prepend-icon="mdi-view-list"
          title="List comments"
          data-automation-id="nav-comments-list-link"
        />
        
        <v-list-subheader>USER DOMAIN</v-list-subheader>
        <v-list-item
          to="/users"
          prepend-icon="mdi-view-list"
          title="List users"
          data-automation-id="nav-users-list-link"
        />
        
      </v-list>

      <template v-slot:append>
        <v-divider />
        <v-list density="compact" nav>
          <v-list-item
            v-if="hasAdminRole"
            to="/admin"
            prepend-icon="mdi-cog"
            title="Admin"
            data-automation-id="nav-admin-link"
          />
          <v-list-item
            @click="handleLogout"
            prepend-icon="mdi-logout"
            title="Logout"
            data-automation-id="nav-logout-link"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useConfig } from '@/composables/useConfig'
import { useRoles } from '@/composables/useRoles'

const router = useRouter()
const { isAuthenticated, logout } = useAuth()
const { loadConfig } = useConfig()
const { hasRole } = useRoles()
const drawer = ref(false)

const hasAdminRole = hasRole('admin')

// Close temporary drawer when route changes (e.g. after clicking nav link)
router.afterEach(() => {
  drawer.value = false
})

onMounted(async () => {
  // Load config if user is already authenticated (e.g., on page reload)
  if (isAuthenticated.value) {
    try {
      await loadConfig()
    } catch (error) {
      // Silently fail - config will be loaded on next login if needed
      console.warn('Failed to load config on mount:', error)
    }
  }
})

function handleLogout() {
  logout()
  drawer.value = false
  router.push('/login')
}
</script>