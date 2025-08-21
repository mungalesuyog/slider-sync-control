import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Settings, Send, Sliders } from 'lucide-react';

interface AxisValues {
  x: number;
  y: number;
  z: number;
}

const ERROR_TYPES = [
  { value: 'calibration', label: 'Calibration Error' },
  { value: 'positioning', label: 'Positioning Error' },
  { value: 'sensor', label: 'Sensor Error' },
  { value: 'communication', label: 'Communication Error' },
  { value: 'mechanical', label: 'Mechanical Error' }
];

const AXIS_OPTIONS = [
  { value: 'x', label: 'X-Axis' },
  { value: 'y', label: 'Y-Axis' },
  { value: 'z', label: 'Z-Axis' }
];

export default function ControlPanel() {
  const [axisValues, setAxisValues] = useState<AxisValues>({ x: 50, y: 50, z: 50 });
  const [selectedError, setSelectedError] = useState<string>('');
  const [selectedAxis, setSelectedAxis] = useState<string>('');
  const [manualValue, setManualValue] = useState<string>('');
  const { toast } = useToast();

  const sendAxisData = useCallback(async (data: AxisValues, source: 'slider' | 'manual') => {
    try {
      // Mock API call
      console.log('Sending axis data:', { data, source });
      
      toast({
        title: "Data sent successfully",
        description: `X: ${data.x}, Y: ${data.y}, Z: ${data.z} (via ${source})`,
      });
    } catch (error) {
      toast({
        title: "Error sending data",
        description: "Failed to send axis values",
        variant: "destructive",
      });
    }
  }, [toast]);

  const sendErrorData = useCallback(async (errorType: string) => {
    try {
      // Mock API call
      console.log('Sending error data:', errorType);
      
      toast({
        title: "Error reported",
        description: `Error type: ${errorType}`,
      });
    } catch (error) {
      toast({
        title: "Error reporting failed",
        description: "Failed to send error report",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleSliderChange = (axis: keyof AxisValues, value: number[]) => {
    const newValues = { ...axisValues, [axis]: value[0] };
    setAxisValues(newValues);
    sendAxisData(newValues, 'slider');
  };

  const handleManualSubmit = () => {
    if (!selectedAxis || !manualValue) {
      toast({
        title: "Invalid input",
        description: "Please select an axis and enter a value",
        variant: "destructive",
      });
      return;
    }

    const value = parseFloat(manualValue);
    if (isNaN(value) || value < 0 || value > 100) {
      toast({
        title: "Invalid value",
        description: "Please enter a value between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    const newValues = { ...axisValues, [selectedAxis]: value };
    setAxisValues(newValues);
    sendAxisData(newValues, 'manual');
    setManualValue('');
    setSelectedAxis('');
  };

  const handleErrorSubmit = () => {
    if (!selectedError) {
      toast({
        title: "No error selected",
        description: "Please select an error type",
        variant: "destructive",
      });
      return;
    }

    sendErrorData(selectedError);
    setSelectedError('');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-primary shadow-glow">
              <Settings className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            3D Control Panel
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Precise positioning control with real-time feedback and error reporting
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Slider Controls */}
          <Card className="p-8 bg-gradient-card backdrop-blur border-border shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <Sliders className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Axis Controls</h2>
            </div>
            
            <div className="space-y-8">
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium capitalize">
                      {axis}-Axis
                    </Label>
                    <div className="px-4 py-2 bg-secondary rounded-lg border">
                      <span className="text-lg font-mono font-bold text-primary">
                        {axisValues[axis].toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={[axisValues[axis]]}
                    onValueChange={(value) => handleSliderChange(axis, value)}
                    max={100}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Manual Input & Error Reporting */}
          <div className="space-y-8">
            {/* Manual Input */}
            <Card className="p-8 bg-gradient-card backdrop-blur border-border shadow-card">
              <h2 className="text-2xl font-semibold mb-6">Manual Input</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Axis</Label>
                  <Select value={selectedAxis} onValueChange={setSelectedAxis}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose axis to control" />
                    </SelectTrigger>
                    <SelectContent>
                      {AXIS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Value (0-100)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    placeholder="Enter value"
                  />
                </div>

                <Button 
                  onClick={handleManualSubmit}
                  className="w-full bg-gradient-button hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Apply Value
                </Button>
              </div>
            </Card>

            {/* Error Reporting */}
            <Card className="p-8 bg-gradient-card backdrop-blur border-border shadow-card">
              <h2 className="text-2xl font-semibold mb-6">Error Reporting</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Error Type</Label>
                  <Select value={selectedError} onValueChange={setSelectedError}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select error type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ERROR_TYPES.map((error) => (
                        <SelectItem key={error.value} value={error.value}>
                          {error.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleErrorSubmit}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Report Error
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Current Values Display */}
        <Card className="p-6 bg-gradient-card backdrop-blur border-border shadow-card">
          <h3 className="text-xl font-semibold mb-4">Current Position</h3>
          <div className="grid grid-cols-3 gap-6">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <div key={axis} className="text-center p-4 bg-secondary rounded-lg border">
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  {axis}-Axis
                </div>
                <div className="text-3xl font-bold text-primary mt-2">
                  {axisValues[axis].toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}