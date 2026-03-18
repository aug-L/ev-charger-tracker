<template>
  <div class="space-y-8">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm hover:border-indigo-500/30 transition-all group">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-slate-400 font-medium">Active Chargers</h3>
          <div class="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
            <Activity class="w-5 h-5 text-indigo-400" />
          </div>
        </div>
        <p class="text-3xl font-bold">{{ stats.activeCount }}</p>
      </div>
      
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm hover:border-emerald-500/30 transition-all group">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-slate-400 font-medium">Total Energy (kWh)</h3>
          <div class="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
            <Zap class="w-5 h-5 text-emerald-400" />
          </div>
        </div>
        <p class="text-3xl font-bold">{{ stats.totalKwh.toFixed(2) }}</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm hover:border-amber-500/30 transition-all group">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-slate-400 font-medium">Estimated Revenue</h3>
          <div class="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
            <DollarSign class="w-5 h-5 text-amber-400" />
          </div>
        </div>
        <p class="text-3xl font-bold">${{ (stats.totalKwh * 2.5).toFixed(2) }}</p>
      </div>
    </div>

    <!-- Active Sessions -->
    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold flex items-center gap-2">
          Live Sessions
          <span class="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs rounded-full border border-indigo-500/20">
            {{ activeSessions.length }}
          </span>
        </h2>
      </div>

      <div v-if="sessions.length === 0" class="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl">
        <div class="p-4 bg-slate-800/50 rounded-full w-fit mx-auto mb-4">
          <Inbox class="w-8 h-8 text-slate-500" />
        </div>
        <p class="text-slate-400">No sessions found. Create one to get started!</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SessionCard 
          v-for="session in sessions" 
          :key="session.id" 
          :session="session"
          @refresh="fetchSessions"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Activity, Zap, DollarSign, Inbox } from 'lucide-vue-next';
import { getSessions } from '../services/api';
import socket from '../services/socket';
import SessionCard from './SessionCard.vue';

const sessions = ref([]);
const stats = ref({ activeCount: 0, totalKwh: 0 });

const activeSessions = computed(() => sessions.value.filter(s => s.status === 'charging'));

const fetchSessions = async () => {
  try {
    const { data } = await getSessions();
    sessions.value = data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
  }
};

onMounted(() => {
  fetchSessions();

  socket.on('energy-update', (data) => {
    const session = sessions.value.find(s => s.id === data.sessionId);
    if (session) {
      session.energyKwh = data.currentKwh;
    }
  });

  socket.on('session-updated', (updatedSession) => {
    const index = sessions.value.findIndex(s => s.id === updatedSession.id);
    if (index !== -1) {
      sessions.value[index] = updatedSession;
    } else {
      sessions.value.unshift(updatedSession);
    }
  });

  socket.on('dashboard-stats', (data) => {
    stats.value = data;
  });
});
</script>
