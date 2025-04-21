#include <stdio.h>

int main()
{
   int n, i;
   printf("Enter number of processes: ");
   scanf("%d", &n);

   int burst_time[n], waiting_time[n], turnaround_time[n];
   printf("Enter burst times:\n");
   for (i = 0; i < n; i++)
   {
      printf("P%d: ", i + 1);
      scanf("%d", &burst_time[i]);
   }

   waiting_time[0] = 0;
   for (i = 1; i < n; i++)
   {
      waiting_time[i] = waiting_time[i - 1] + burst_time[i - 1];
   }

   for (i = 0; i < n; i++)
   {
      turnaround_time[i] = waiting_time[i] + burst_time[i];
   }

   float total_wt = 0, total_tat = 0;
   printf("\nProcess\tBT\tWT\tTAT\n");
   for (i = 0; i < n; i++)
   {
      printf("P%d\t%d\t%d\t%d\n", i + 1, burst_time[i], waiting_time[i], turnaround_time[i]);
      total_wt += waiting_time[i];
      total_tat += turnaround_time[i];
   }

   printf("\nAverage Waiting Time = %.2f", total_wt / n);
   printf("\nAverage Turnaround Time = %.2f\n", total_tat / n);

   return 0;
}
