import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "~app/components/common";
import {
  calculateAndFormatPercentageChange,
  formatChartDate,
  formatPrice,
} from "~app/helpers";
import type { PriceRecord } from "~app/services";
import { cn } from "~app/utils";

interface PriceChartProps {
  data: PriceRecord[];
  currency: string;
  isLoading?: boolean;
  height?: number;
}

export function PriceChart({
  data,
  currency,
  isLoading = false,
  height = 400,
}: PriceChartProps) {
  const { t } = useTranslation();

  // Prepare chart options
  const chartOptions = useMemo(() => {
    if (!data || data.length === 0) return null;

    const seriesData = data.map((item) => [
      new Date(item.date).getTime(),
      item.price,
    ]);

    const firstPrice = data[0]?.price || 0;
    const lastPrice = data[data.length - 1]?.price || 0;
    const isPositive = lastPrice >= firstPrice;
    const trendColor = isPositive ? "#14b8a6" : "#ef4444";
    const gradientColor = isPositive ? "#14b8a6" : "#ef4444";

    return {
      chart: {
        type: "spline",
        height: height,
        backgroundColor: "transparent",
        plotBorderWidth: 0,
        margin: [20, 20, 60, 60],
        style: {
          fontFamily: "inherit",
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
      title: {
        text: null,
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: "datetime",
        lineColor: "rgba(255, 255, 255, 0.2)",
        tickColor: "rgba(255, 255, 255, 0.2)",
        gridLineColor: "rgba(255, 255, 255, 0.1)",
        gridLineWidth: 1,
        labels: {
          style: {
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "12px",
          },
          formatter: function (this: any) {
            return formatChartDate(new Date(this.value).toISOString());
          },
        },
      },
      yAxis: {
        title: {
          text: t("priceHistory.price"),
          style: {
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "12px",
            fontWeight: "normal",
          },
        },
        lineColor: "rgba(255, 255, 255, 0.2)",
        tickColor: "rgba(255, 255, 255, 0.2)",
        gridLineColor: "rgba(255, 255, 255, 0.1)",
        gridLineWidth: 1,
        labels: {
          style: {
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "12px",
          },
          formatter: function (this: any) {
            return formatPrice(this.value as number);
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 8,
        borderWidth: 1,
        shadow: true,
        style: {
          color: "white",
          fontSize: "12px",
        },
        formatter: function (this: any) {
          return `
            <div style="text-align: center;">
              <div style="font-weight: bold; margin-bottom: 4px;">${currency}</div>
              <div style="color: ${trendColor}; font-size: 14px; font-weight: bold;">
                ${formatPrice(this.y)}
              </div>
              <div style="color: rgba(255, 255, 255, 0.7); font-size: 11px;">
                ${formatChartDate(new Date(this.x).toISOString())}
              </div>
            </div>
          `;
        },
        useHTML: true,
      },
      plotOptions: {
        spline: {
          lineWidth: 3,
          states: {
            hover: {
              lineWidth: 4,
            },
          },
          marker: {
            enabled: true,
            radius: 4,
            fillColor: trendColor,
            lineColor: "white",
            lineWidth: 1,
            states: {
              hover: {
                enabled: true,
                radius: 6,
                lineWidth: 2,
                lineColor: "white",
              },
            },
          },
          animation: {
            duration: 1000,
          },
        },
        series: {
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, `${gradientColor}40`],
              [1, `${gradientColor}05`],
            ],
          },
        },
      },
      series: [
        {
          name: currency,
          data: seriesData,
          color: trendColor,
          fillOpacity: 0.3,
          lineWidth: 3,
          shadow: {
            color: trendColor,
            width: 10,
            opacity: 0.2,
          },
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 768,
            },
            chartOptions: {
              chart: {
                margin: [10, 10, 40, 40],
              },
              yAxis: {
                title: {
                  text: null,
                },
              },
            },
          },
        ],
      },
    };
  }, [data, currency, height, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" variant="spinner" />
        <span className="ml-3 text-white/70">{t("token.loading")}</span>
      </div>
    );
  }

  if (!chartOptions || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-white/70">
        <span>{t("priceHistory.noData")}</span>
      </div>
    );
  }

  const firstPrice = data[0]?.price || 0;
  const lastPrice = data[data.length - 1]?.price || 0;
  const isPositive = lastPrice >= firstPrice;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h3 className="text-lg font-semibold text-white">
              {currency} {t("priceHistory.priceChart")}
            </h3>
          </div>
          <div className="flex items-center space-x-4 ml-11">
            <span className="text-sm text-white/70">
              {t("priceHistory.periodChange")}: {formatPrice(firstPrice)} →{" "}
              {formatPrice(lastPrice)}
            </span>
            <span
              className={cn(
                "text-sm font-medium",
                isPositive ? "text-teal-400" : "text-red-400"
              )}
            >
              {isPositive ? "↗" : "↘"}{" "}
              {calculateAndFormatPercentageChange(firstPrice, lastPrice)}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div
        className={cn(
          "relative group glass rounded-2xl p-4 border border-white/20 hover:border-teal-400/30 transition-all duration-300",
          "after:content-[''] after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-300 after:pointer-events-none after:animate-pulse-glow after:rounded-2xl",
          isPositive
            ? "after:bg-gradient-to-br after:from-teal-400/20 after:to-transparent"
            : "after:bg-gradient-to-br after:from-red-400/20 after:to-transparent"
        )}
      >
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          containerProps={{
            style: { height: `${height}px`, width: "100%" },
          }}
        />
      </div>
    </div>
  );
}
