// src/screens/UIKitScreen.tsx — Live demo of EVERY ported UI component

import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { AppThemeName, COLORS, SPACING, RADIUS, THEME_OPTIONS, useAppTheme } from '../constants/theme';

// Batch 1
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/Accordion';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/Alert';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '../components/ui/AlertDialog';
import { Avatar, AvatarFallback } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/Breadcrumb';
import { Button } from '../components/ui/Button';
import { Calendar } from '../components/ui/Calendar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
// Batch 2
import { Carousel, CarouselContent, CarouselItem, CarouselDots } from '../components/ui/Carousel';
import { Checkbox, CheckboxWithLabel } from '../components/ui/Checkbox';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../components/ui/Collapsible';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '../components/ui/Drawer';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '../components/ui/DropdownMenu';
import { Input } from '../components/ui/Input';
import { InputOTP } from '../components/ui/InputOTP';
import { Label } from '../components/ui/Label';
// Batch 3
import { Progress } from '../components/ui/Progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/RadioGroup';
import { ScrollArea } from '../components/ui/ScrollArea';
import { Select } from '../components/ui/Select';
import { Separator } from '../components/ui/Separator';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '../components/ui/Sheet';
import { Skeleton, SkeletonText, SkeletonCard } from '../components/ui/Skeleton';
import { Slider } from '../components/ui/Slider';
import { Switch } from '../components/ui/Switch';
// Batch 4
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/Table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Textarea } from '../components/ui/Textarea';
import { Toggle } from '../components/ui/Toggle';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/ToggleGroup';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/Tooltip';
import { toast } from '../hooks/use-toast';

const UIKitScreen = () => {
  const { themeName, setThemeName } = useAppTheme();
  const s = useMemo(() => createStyles(), [themeName]);
  const [calDate, setCalDate] = useState<Date | null>(null);
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState('b');
  const [slider, setSlider] = useState(40);
  const [sw, setSw] = useState(true);
  const [otpVal, setOtpVal] = useState('');
  const [toggle, setToggle] = useState(false);
  const [toggleGroup, setToggleGroup] = useState<string[]>(['bold']);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const handleDemoButtonPress = (label: string) => {
    toast({
      title: `${label} button works`,
      description: 'This button is now wired and responding inside the UI kit screen.',
    });
  };

  const handleThemeChange = (nextTheme: AppThemeName) => {
    if (nextTheme === themeName) {
      return;
    }

    setThemeName(nextTheme);
    const nextLabel = THEME_OPTIONS.find((option) => option.value === nextTheme)?.label ?? nextTheme;
    toast({
      title: 'Theme updated',
      description: `${nextLabel} theme applied.`,
    });
  };

  return (
    <TooltipProvider>
      <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Theme */}
        <Section title="Theme">
          <View style={s.row}>
            {THEME_OPTIONS.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={themeName === option.value ? 'default' : 'outline'}
                onPress={() => handleThemeChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </View>
          <Text style={s.helperText}>
            Switch the interface between black, green, and white styles.
          </Text>
        </Section>

        {/* Button */}
        <Section title="Button">
          <View style={s.row}>
            <Button variant="default" size="default" onPress={() => handleDemoButtonPress('Default')}>Default</Button>
            <Button variant="destructive" onPress={() => handleDemoButtonPress('Destructive')}>Destructive</Button>
            <Button variant="outline" onPress={() => handleDemoButtonPress('Outline')}>Outline</Button>
          </View>
          <View style={s.row}>
            <Button variant="secondary" onPress={() => handleDemoButtonPress('Secondary')}>Secondary</Button>
            <Button variant="ghost" onPress={() => handleDemoButtonPress('Ghost')}>Ghost</Button>
            <Button variant="link" onPress={() => handleDemoButtonPress('Link')}>Link</Button>
          </View>
        </Section>

        {/* Badge */}
        <Section title="Badge">
          <View style={s.row}>
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </View>
        </Section>

        {/* Alert */}
        <Section title="Alert">
          <Alert variant="default">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>You can add components to your app.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Your session has expired.</AlertDescription>
          </Alert>
        </Section>

        {/* AlertDialog */}
        <Section title="AlertDialog">
          <AlertDialog>
            <AlertDialogTrigger><Button variant="outline">Open Alert Dialog</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Section>

        {/* Accordion */}
        <Section title="Accordion">
          <Accordion type="single" defaultValue="q1">
            <AccordionItem value="q1"><AccordionTrigger>Is it accessible?</AccordionTrigger><AccordionContent>Yes. It follows WAI-ARIA patterns.</AccordionContent></AccordionItem>
            <AccordionItem value="q2"><AccordionTrigger>Is it animated?</AccordionTrigger><AccordionContent>Yes. Animated by default.</AccordionContent></AccordionItem>
          </Accordion>
        </Section>

        {/* Avatar */}
        <Section title="Avatar">
          <View style={s.row}>
            {['AB', 'SX', 'RN', 'UI'].map((fb) => (
              <Avatar key={fb} size={44}><AvatarFallback>{fb}</AvatarFallback></Avatar>
            ))}
          </View>
        </Section>

        {/* Breadcrumb */}
        <Section title="Breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink onPress={() => {}}>Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink onPress={() => {}}>Components</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Section>

        {/* Card */}
        <Section title="Card">
          <Card>
            <CardHeader>
              <CardTitle>Ride Comparison</CardTitle>
              <CardDescription>Compare fares across all ride services.</CardDescription>
            </CardHeader>
            <CardContent>
              <Text style={{ color: COLORS.mutedForeground, fontSize: 14 }}>Card content goes here.</Text>
            </CardContent>
            <CardFooter style={{ justifyContent: 'flex-end', gap: 8 }}>
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm">Compare</Button>
            </CardFooter>
          </Card>
        </Section>

        {/* Calendar */}
        <Section title="Calendar">
          <Calendar selected={calDate} onSelect={setCalDate} minDate={new Date()} />
          {calDate && <Text style={{ color: COLORS.primary, fontSize: 12, marginTop: 4 }}>Selected: {calDate.toDateString()}</Text>}
        </Section>

        {/* Carousel */}
        <Section title="Carousel">
          <Carousel>
            <CarouselContent>
              {['🚗 Uber Go', '🛺 Rapido Auto', '🚕 Ola Mini'].map((label, i) => (
                <CarouselItem key={i}>
                  <View style={{ backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, marginRight: SPACING.sm }}>
                    <Text style={{ color: COLORS.foreground, fontSize: 16, fontWeight: '700' }}>{label}</Text>
                  </View>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <CarouselDots />
        </Section>

        {/* Checkbox */}
        <Section title="Checkbox">
          <View style={s.col}>
            <CheckboxWithLabel checked={checked} onCheckedChange={setChecked} label="Accept terms and conditions" />
            <CheckboxWithLabel checked={true} onCheckedChange={() => {}} label="Always checked" disabled />
          </View>
        </Section>

        {/* Collapsible */}
        <Section title="Collapsible">
          <Collapsible>
            <CollapsibleTrigger>
              <View style={s.collapsibleTrigger}>
                <Text style={{ color: COLORS.foreground, fontWeight: '600' }}>Toggle content ▾</Text>
              </View>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <View style={s.collapsibleContent}>
                <Text style={{ color: COLORS.mutedForeground, fontSize: 13 }}>This content is hidden by default and shown when triggered.</Text>
              </View>
            </CollapsibleContent>
          </Collapsible>
        </Section>

        {/* Dialog */}
        <Section title="Dialog">
          <Dialog>
            <DialogTrigger><Button variant="outline">Open Dialog</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Make changes to your profile here.</DialogDescription>
              </DialogHeader>
              <Input placeholder="Your name" containerStyle={{ marginTop: SPACING.sm }} />
              <DialogFooter>
                <Button size="sm">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        {/* Drawer */}
        <Section title="Drawer">
          <Drawer>
            <DrawerTrigger><Button variant="outline">Open Drawer</Button></DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Ride Details</DrawerTitle>
                <DrawerDescription>Swipe down or tap outside to close.</DrawerDescription>
              </DrawerHeader>
              <View style={{ padding: SPACING.md }}>
                <Text style={{ color: COLORS.mutedForeground, fontSize: 14 }}>Drawer content here.</Text>
              </View>
            </DrawerContent>
          </Drawer>
        </Section>

        {/* Dropdown */}
        <Section title="DropdownMenu">
          <DropdownMenu>
            <DropdownMenuTrigger><Button variant="outline">Open Dropdown ▾</Button></DropdownMenuTrigger>
            <DropdownMenuContent items={[
              { id: '1', label: 'Profile', onPress: () => {} },
              { id: '2', label: 'Settings', onPress: () => {} },
              { id: 'sep', label: '', type: 'separator' },
              { id: '3', label: 'Sign out', destructive: true, onPress: () => {} },
            ]} />
          </DropdownMenu>
        </Section>

        {/* Input */}
        <Section title="Input">
          <Input placeholder="Enter location…" />
          <Input placeholder="Disabled input" editable={false} />
        </Section>

        {/* InputOTP */}
        <Section title="InputOTP">
          <InputOTP maxLength={6} value={otpVal} onChange={setOtpVal} />
          {otpVal.length === 6 && <Text style={{ color: COLORS.accent, fontSize: 12, marginTop: 4 }}>✓ Code complete: {otpVal}</Text>}
        </Section>

        {/* Label */}
        <Section title="Label">
          <Label required>Email address</Label>
          <Label disabled>Disabled label</Label>
        </Section>

        {/* Progress */}
        <Section title="Progress">
          <Progress value={30} showLabel />
          <Progress value={65} color={COLORS.accent} showLabel />
          <Progress value={90} color='#F59E0B' showLabel />
        </Section>

        {/* RadioGroup */}
        <Section title="RadioGroup">
          <RadioGroup value={radio} onValueChange={setRadio}>
            <RadioGroupItem value="a" label="Uber Go" />
            <RadioGroupItem value="b" label="Ola Mini" />
            <RadioGroupItem value="c" label="Rapido Auto" />
          </RadioGroup>
        </Section>

        {/* Select */}
        <Section title="Select">
          <Select
            placeholder="Select ride type…"
            options={[
              { value: 'auto', label: 'Auto', group: 'Economy' },
              { value: 'bike', label: 'Bike', group: 'Economy' },
              { value: 'cab', label: 'Cab', group: 'Premium' },
              { value: 'suv', label: 'SUV', group: 'Premium' },
            ]}
          />
        </Section>

        {/* Separator */}
        <Section title="Separator">
          <View style={s.row}>
            <Text style={{ color: COLORS.foreground }}>Blog</Text>
            <Separator orientation="vertical" style={{ height: 16, marginHorizontal: SPACING.sm }} />
            <Text style={{ color: COLORS.foreground }}>Docs</Text>
            <Separator orientation="vertical" style={{ height: 16, marginHorizontal: SPACING.sm }} />
            <Text style={{ color: COLORS.foreground }}>About</Text>
          </View>
          <Separator />
        </Section>

        {/* Sheet */}
        <Section title="Sheet">
          <View style={s.row}>
            {(['left', 'right', 'bottom'] as const).map((side) => (
              <Sheet key={side}>
                <SheetTrigger><Button variant="outline" size="sm">{side}</Button></SheetTrigger>
                <SheetContent side={side}>
                  <SheetHeader><SheetTitle>Sheet ({side})</SheetTitle></SheetHeader>
                  <Text style={{ color: COLORS.mutedForeground, marginTop: SPACING.md }}>Sheet content here.</Text>
                </SheetContent>
              </Sheet>
            ))}
          </View>
        </Section>

        {/* Skeleton */}
        <Section title="Skeleton">
          <SkeletonCard />
          <SkeletonText lines={3} style={{ marginTop: SPACING.md }} />
        </Section>

        {/* Slider */}
        <Section title="Slider">
          <Slider value={slider} onValueChange={setSlider} showValue />
          <Slider value={75} disabled showValue />
        </Section>

        {/* Switch */}
        <Section title="Switch">
          <View style={s.row}>
            <Switch checked={sw} onCheckedChange={setSw} />
            <Text style={{ color: COLORS.foreground }}>{sw ? 'On' : 'Off'}</Text>
            <Switch checked={true} disabled />
            <Text style={{ color: COLORS.muted }}>Disabled</Text>
          </View>
        </Section>

        {/* Table */}
        <Section title="Table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead align="right">Price</TableHead>
                <TableHead align="right">ETA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[['Rapido Auto', '₹87', '3 min'], ['Ola Mini', '₹102', '5 min'], ['Uber Go', '₹118', '4 min']].map(([s, p, e]) => (
                <TableRow key={s}>
                  <TableCell>{s}</TableCell>
                  <TableCell align="right">{p}</TableCell>
                  <TableCell align="right">{e}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {/* Tabs */}
        <Section title="Tabs">
          <Tabs defaultValue="compare">
            <TabsList>
              <TabsTrigger value="compare">Compare</TabsTrigger>
              <TabsTrigger value="surge">Surge</TabsTrigger>
              <TabsTrigger value="carbon">Carbon</TabsTrigger>
            </TabsList>
            <TabsContent value="compare"><Text style={{ color: COLORS.mutedForeground, fontSize: 13, marginTop: SPACING.sm }}>Compare fares across all services in real time.</Text></TabsContent>
            <TabsContent value="surge"><Text style={{ color: COLORS.mutedForeground, fontSize: 13, marginTop: SPACING.sm }}>Understand surge pricing logic transparently.</Text></TabsContent>
            <TabsContent value="carbon"><Text style={{ color: COLORS.mutedForeground, fontSize: 13, marginTop: SPACING.sm }}>Track your carbon footprint per ride.</Text></TabsContent>
          </Tabs>
        </Section>

        {/* Textarea */}
        <Section title="Textarea">
          <Textarea placeholder="Type your feedback…" />
        </Section>

        {/* Toast */}
        <Section title="Toast (via useToast hook)">
          <View style={s.row}>
            <Button size="sm" onPress={() => toast({ title: 'Success!', description: 'Your ride was booked.' })}>Default</Button>
            <Button size="sm" variant="destructive" onPress={() => toast({ title: 'Error', description: 'Could not fetch fares.', variant: 'destructive' })}>Error</Button>
          </View>
        </Section>

        {/* Toggle */}
        <Section title="Toggle">
          <View style={s.row}>
            <Toggle pressed={toggle} onPressedChange={setToggle} variant="outline">Bold</Toggle>
            <Toggle pressed={false} variant="outline">Italic</Toggle>
            <Toggle pressed={true} variant="default">Active</Toggle>
            <Toggle pressed={false} disabled variant="outline">Disabled</Toggle>
          </View>
        </Section>

        {/* ToggleGroup */}
        <Section title="ToggleGroup">
          <ToggleGroup type="multiple" value={toggleGroup} onValueChange={(v) => setToggleGroup(v as string[])} variant="outline">
            <ToggleGroupItem value="bold">B</ToggleGroupItem>
            <ToggleGroupItem value="italic">I</ToggleGroupItem>
            <ToggleGroupItem value="underline">U</ToggleGroupItem>
          </ToggleGroup>
        </Section>

        {/* Tooltip */}
        <Section title="Tooltip">
          <View style={s.row}>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" size="sm">Long-press me</Button>
              </TooltipTrigger>
              <TooltipContent>Add to library</TooltipContent>
            </Tooltip>
          </View>
        </Section>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </TooltipProvider>
  );
};

const createStyles = () => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  section: { marginBottom: SPACING.xl, gap: SPACING.sm },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: COLORS.primary,
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: SPACING.xs,
    borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: SPACING.xs,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, alignItems: 'center' },
  col: { gap: SPACING.sm },
  helperText: {
    color: COLORS.mutedForeground,
    fontSize: 13,
    lineHeight: 18,
  },
  collapsibleTrigger: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: SPACING.md,
  },
  collapsibleContent: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: SPACING.md, marginTop: SPACING.xs,
  },
});

export default UIKitScreen;
