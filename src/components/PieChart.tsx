import { Component, onMount, onCleanup } from 'solid-js';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

interface PieData {
  platform: string;
  percentage: number;
  color: string;
}

interface PieChartProps {
  data: PieData[];
  title: string;
}

const PieChart: Component<PieChartProps> = (props) => {
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
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      })
    );

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "percentage",
        categoryField: "platform",
        alignLabels: false
      })
    );

    // Hide labels and ticks
    series.labels.template.setAll({
      textType: "circular",
      centerX: 0,
      centerY: 0,
      fontSize: "12px",
      fontWeight: "500"
    });

    series.ticks.template.setAll({
      visible: false
    });

    // Set colors
    series.get("colors")?.set("colors", [
      am5.color("#10b981"), // Green
      am5.color("#34d399"), // Light green
      am5.color("#6ee7b7")  // Lighter green
    ]);

    // Transform data for amCharts
    const chartData = props.data.map(item => ({
      platform: item.platform,
      percentage: item.percentage
    }));

    // Set data
    series.data.setAll(chartData);

    // Create legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 20,
        marginBottom: 15,
        layout: root.horizontalLayout
      })
    );

    // Style legend labels
    legend.labels.template.setAll({
      fontSize: "14px",
      fontWeight: "500"
    });

    legend.valueLabels.template.setAll({
      fontSize: "14px",
      fontWeight: "600"
    });

    legend.data.setAll(series.dataItems);

    // Make stuff animate on load
    series.appear(1000, 100);
  });

  onCleanup(() => {
    if (root) {
      root.dispose();
    }
  });

  return (
    <div 
      ref={chartDiv} 
      class="w-full h-80"
      style={{ width: '100%', height: '320px' }}
    />
  );
};

export default PieChart;
