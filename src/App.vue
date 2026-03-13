<template>
    <div class="max-w-6xl mx-auto px-10 py-12 pb-20">
        <header class="mb-10">
            <h1
                class="font-bebas mb-4"
                style="
                    font-size: clamp(44px, 7vw, 80px);
                    line-height: 0.92;
                    letter-spacing: 0.01em;
                "
            >
                Salarios por<br />
                <span style="color: var(--accent)">Comunidad</span><br />
                Autónoma
            </h1>
            <p
                style="
                    color: var(--muted);
                    font-size: 14px;
                    max-width: 500px;
                    line-height: 1.7;
                "
            >
                Distribución salarial en España por comunidad autónoma, sexo y
                año.<br />
                <span style="color: var(--accent)">Hover</span> sobre el mapa
                para ver los datos ·
                <span style="color: var(--accent)">Clic</span> para fijar una
                región.
            </p>
        </header>

        <div class="grid grid-cols-2 gap-3 mb-8" style="max-width: 380px">
            <div>
                <div style="font-size:11px;color:var(--muted);margin-bottom:8px;">Sexo</div>
                <select v-model="selectedSex">
                    <option value="Ambos sexos">Todos</option>
                    <option value="Mujeres">Mujeres</option>
                    <option value="Hombres">Hombres</option>
                </select>
            </div>
            <div>
                <div style="font-size:11px;color:var(--muted);margin-bottom:8px;">Año</div>
                <select v-model="selectedYear">
                    <option v-for="y in YEARS" :key="y" :value="y">
                        {{ y }}
                    </option>
                </select>
            </div>
        </div>

        <div
            class="main-grid"
            style="
                display: grid;
                grid-template-columns: 1fr 340px;
                gap: 16px;
                align-items: start;
            "
        >
            <div style="display: flex; flex-direction: column; gap: 16px">
                <SpainMap
                    :sex="selectedSex"
                    :year="selectedYear"
                    :selected-region="selectedRegion"
                    @hover="hoveredRegion = $event"
                    @select="onSelectRegion"
                />
                <RankingTable
                    :sex="selectedSex"
                    :year="selectedYear"
                    :selected-region="selectedRegion"
                    @select="onSelectRegion"
                />
            </div>
            <div style="display: flex; flex-direction: column; gap: 16px">
                <RegionDetail
                    :region="hoveredRegion || selectedRegion"
                    :sex="selectedSex"
                    :year="selectedYear"
                />
                <SalaryChecker
                    v-if="selectedRegion"
                    :region="selectedRegion"
                    :sex="selectedSex"
                    :year="selectedYear"
                />
                <TrendChart
                    v-if="selectedRegion"
                    :region="selectedRegion"
                    :sex="selectedSex"
                />
            </div>
        </div>

        <footer
            class="mt-8"
            style="
                font-size: 11px;
                color: var(--muted);
                font-family: &quot;DM Mono&quot;, monospace;
            "
        >
            Fuente: INE – Encuesta de Estructura Salarial 2008–2023. Datos en
            euros brutos anuales.
        </footer>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useSalary } from "@/composables/useSalary.js";
import SpainMap from "@/components/SpainMap.vue";
import RankingTable from "@/components/RankingTable.vue";
import RegionDetail from "@/components/RegionDetail.vue";
import SalaryChecker from "@/components/SalaryChecker.vue";
import TrendChart from "@/components/TrendChart.vue";

const { YEARS } = useSalary();
const selectedSex = ref("Ambos sexos");
const selectedYear = ref("2023");
const hoveredRegion = ref(null);
const selectedRegion = ref(null);

function onSelectRegion(ccaa) {
    selectedRegion.value = selectedRegion.value === ccaa ? null : ccaa;
}
</script>

<style scoped>
@media (max-width: 900px) {
    .main-grid {
        grid-template-columns: 1fr !important;
    }
}
</style>
