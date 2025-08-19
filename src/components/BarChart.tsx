import { Component, onMount, onCleanup } from 'solid-js';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

interface ChartData {
  month: string;
  value: number;
}

interface BarChartProps {
  data: ChartData[];
  title: string;
}

const BarChart: Component<BarChartProps> = (props) => {
  let chartDiv: HTMLDivElement | undefined;
  let root: am5.Root | undefined;

  onMount(() => {
    if (!chartDiv) return;

    // Create root element
    root = am5.Root.new(chartDiv);

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0
      })
    );

    // Create axes
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      cellStartLocation: 0.1,
      cellEndLocation: 0.9
    });

    xRenderer.labels.template.setAll({
      centerY: am5.p50,
      centerX: am5.p50
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "month",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    const yRenderer = am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1
    });

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: yRenderer
      })
    );

    // Create series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: props.title,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "month",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{categoryX}: {valueY}"
        })
      })
    );

    // Set column appearance
    series.columns.template.setAll({
      cornerRadiusTL: 5,
      cornerRadiusTR: 5,
      strokeOpacity: 0,
      fill: am5.color("#3b82f6") // Blue color
    });

    // Set data
    xAxis.data.setAll(props.data);
    series.data.setAll(props.data);

    // Make stuff animate on load
    series.appear(1000);
    chart.appear(1000, 100);
  });

  onCleanup(() => {
    if (root) {
      root.dispose();
    }
  });

  return (
    <div 
      ref={chartDiv} 
      class="w-full h-48"
      style={{ width: '100%', height: '192px' }}
    />
  );
};

export default BarChart;
