<template>
  <div class="min-h-screen bg-slate-950 text-slate-50 font-sans">
    <header
      class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10"
    >
      <div
        class="container mx-auto px-4 py-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <div
            class="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20"
          >
            <Zap class="w-6 h-6 text-white" />
          </div>
          <h1
            class="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
          >
            EV ChargeTrack
          </h1>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="showCreateModal = true"
            class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
          >
            <Plus class="w-4 h-4" />
            New Session
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <Dashboard />
    </main>

    <!-- Simple Create Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <h2 class="text-xl font-bold mb-4">New Charging Session</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-400 mb-1"
              >Charger ID</label
            >
            <input
              v-model="newChargerId"
              type="text"
              placeholder="e.g. CH-001"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div class="flex gap-3 mt-6">
            <button
              @click="showCreateModal = false"
              class="flex-1 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              @click="handleCreateSession"
              :disabled="!newChargerId"
              class="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-indigo-600/20"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Zap, Plus } from "lucide-vue-next";
import Dashboard from "./components/Dashboard.vue";
import { createSession } from "./services/api";

const showCreateModal = ref(false);
const newChargerId = ref("");

const handleCreateSession = async () => {
  if (!newChargerId.value) return;
  try {
    await createSession({ chargerId: newChargerId.value });
    newChargerId.value = "";
    showCreateModal.value = false;
    // The Dashboard will update via Socket.io if the backend emits session events,
    // or we might need to trigger a refresh.
  } catch (error) {
    console.error("Failed to create session:", error);
  }
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-slate-950;
}
</style>
