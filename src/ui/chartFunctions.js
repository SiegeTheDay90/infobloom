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

export function attachScatterPlot(canvasEl, data, options = {}){
    if(!canvasEl || !canvasEl.getContext) return;
    const ctx = canvasEl.getContext('2d');

    if(Chart.getChart(canvasEl)){
        Chart.getChart(canvasEl).destroy();
    };

    try{
        return new Chart(ctx, {
            type: 'scatter',
            data,
            options
        })
    } catch(e){
        console.error("Error creating scatter plot chart:", e);
        return null;
    }
}

export function attachRadarChart(canvasEl, data, options = {}){
    if(!canvasEl || !canvasEl.getContext) return;
    const ctx = canvasEl.getContext('2d');

    if(Chart.getChart(canvasEl)){
        Chart.getChart(canvasEl).destroy();
    };

    try{
        return new Chart(ctx, {
            type: 'radar',
            data,
            options
        })
    } catch(e){
        console.error("Error creating radar chart:", e);
        return null;
    }
}

export function attachBoxPlot(canvasEl, data, options = {}){
    if(!canvasEl || !canvasEl.getContext) return;
    const ctx = canvasEl.getContext('2d');

    if(Chart.getChart(canvasEl)){
        Chart.getChart(canvasEl).destroy();
    };

    try{
        return new Chart(ctx, {
            type: 'boxplot',
            data,
            options
        })
    } catch(e){
        console.error("Error creating box plot chart:", e);
        return null;
    }
}