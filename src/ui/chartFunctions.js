import Chart from 'chart.js/auto';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';

Chart.register(BoxPlotController, BoxAndWiskers);
Chart.register(MatrixController, MatrixElement);

export function attachHistogram(canvasEl, data, options = {}){
    if(!canvasEl || !canvasEl.getContext) return;
    const ctx = canvasEl.getContext('2d');

    if(Chart.getChart(canvasEl)){
        Chart.getChart(canvasEl).destroy();
    };

    try{
        return new Chart(ctx, {
            type: 'bar',
            data,
            options
        })
    } catch(e){
        console.error("Error creating histogram chart:", e);
        return null;
    }
}

export function attachHeatMap(canvasEl, data, options = {}){
    if(!canvasEl || !canvasEl.getContext) return;
    const ctx = canvasEl.getContext('2d');

    if(Chart.getChart(canvasEl)){
        Chart.getChart(canvasEl).destroy();
    };

    try{
        return new Chart(ctx, {
            type: 'matrix',
            data,
            options
        })
    } catch(e){
        console.error("Error creating heatmap chart:", e);
        return null;
    }
}

export function attachMatrixChart(canvasEl, data, options = {}){
    if(!canvasEl || !canvasEl.getContext) return;
    const ctx = canvasEl.getContext('2d');

    if(Chart.getChart(canvasEl)){
        Chart.getChart(canvasEl).destroy();
    };
    debugger;
    try{
        return new Chart(ctx, {
            type: 'matrix',
            data,
            options
        })
    } catch(e){
        console.error("Error creating matrix chart:", e);
        return null;
    }
}