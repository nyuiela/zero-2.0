import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function AdminSubscriptionSection({ form }: { form: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-brand">Admin & Subscription</h3>
      <FormField
        control={form.control}
        name="brandAdminAddr"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brand Admin Address</FormLabel>
            <FormControl>
              <Input placeholder="0x..." {...field} className="font-mono" />
            </FormControl>
            <FormDescription>
              Ethereum address of the brand administrator
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="subscriptionId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subscription ID</FormLabel>
            <FormControl>
              <Input type="number" placeholder="1" {...field} />
            </FormControl>
            <FormDescription>
              Chainlink VRF subscription ID for random number generation
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="stateUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State URL</FormLabel>
            <FormControl>
              <Input placeholder="https://api.example.com/brand-state" {...field} />
            </FormControl>
            <FormDescription>
              URL where the brand state information is stored
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 