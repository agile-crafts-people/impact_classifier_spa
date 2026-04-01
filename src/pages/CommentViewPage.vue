<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-4">View Comment</h1>
      </v-col>
    </v-row>

    <v-row v-if="isLoading">
      <v-col class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-col>
    </v-row>

    <v-row v-else-if="comment">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-text>
            <v-text-field
              :model-value="comment.name"
              label="Name"
              readonly
              variant="outlined"
            />

            <v-textarea
              :model-value="comment.description || 'N/A'"
              label="Description"
              readonly
              variant="outlined"
              rows="3"
              class="mt-4"
            />

            <v-text-field
              :model-value="comment.status || 'N/A'"
              label="Status"
              readonly
              variant="outlined"
              class="mt-4"
            />

            <v-card-actions class="px-0 mt-4">
              <v-btn @click="router.push('/comments')" variant="text">
                Back to List
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar :model-value="showError as unknown as boolean" color="error" :timeout="5000">
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useErrorHandler } from '@agile-crafts-people/impact_spa_utils'
import { api } from '@/api/client'

const routeLocation = useRoute()
const router = useRouter()

const commentId = computed(() => routeLocation.params.id as string)

const { data: comment, isLoading, error: queryError } = useQuery({
  queryKey: ['comment', commentId],
  queryFn: () => api.getComment(commentId.value),
})

const errorRef = ref<Error | null>(null)
watch(queryError, (err) => {
  errorRef.value = err
}, { immediate: true })

const { showError, errorMessage } = useErrorHandler(errorRef as any)
</script>