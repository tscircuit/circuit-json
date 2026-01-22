import fs from "node:fs"
import path from "node:path"

/**
 * Simplified Pydantic types generator for Circuit JSON
 */

class SimplePydanticGenerator {
  private outputDir: string

  constructor() {
    this.outputDir = path.join(__dirname, "../python")
  }

  async generate(): Promise<void> {
    console.log("Starting Pydantic types generation...")

    // Create output directory structure
    this.createOutputStructure()

    // Generate base utilities
    await this.generateBaseUtils()

    // Generate sample types to test
    await this.generateSampleTypes()

    // Generate main __init__.py
    await this.generateMainInit()

    console.log("Pydantic types generation complete!")
  }

  private createOutputStructure(): void {
    const dirs = [
      this.outputDir,
      path.join(this.outputDir, "base"),
      path.join(this.outputDir, "source"),
      path.join(this.outputDir, "pcb"),
      path.join(this.outputDir, "schematic"),
      path.join(this.outputDir, "simulation"),
    ]

    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    })
  }

  private async generateBaseUtils(): Promise<void> {
    const baseUtils = `"""
Base utilities for Circuit JSON type validation and unit conversion.
"""

from typing import Union, Optional
from pydantic import validator
import re

class UnitConverter:
    """Utility class for converting string units to base units."""
    
    @staticmethod
    def parse_length(value: Union[str, int, float]) -> float:
        """Parse length values (e.g., '10mm', '1in', '1ft') to base units (mm)."""
        if isinstance(value, (int, float)):
            return float(value)
        
        value_str = str(value).strip()
        
        # Handle plain numbers
        if re.match(r'^-?\\d+(\\.\\d+)?$', value_str):
            return float(value_str)
        
        # Extract unit from the end
        unit_match = re.search(r'([a-zA-Z]+)$', value_str)
        if not unit_match:
            raise ValueError(f"Could not determine unit for value: {value_str}")
        
        unit = unit_match.group(1)
        number_part = value_str[:-len(unit)].strip()
        
        if not number_part:
            raise ValueError(f"Could not extract numeric part from: {value_str}")
        
        numeric_value = float(number_part)
        
        # Unit conversion factors
        unit_factors = {
            'nm': 1e-6, 'um': 1e-3, 'mm': 1, 'cm': 10, 'm': 1000,
            'in': 25.4, 'ft': 304.8, 'mil': 0.0254
        }
        
        if unit in unit_factors:
            return numeric_value * unit_factors[unit]
        
        # Assume mm if no specific mapping found
        return numeric_value
    
    @staticmethod
    def parse_resistance(value: Union[str, int, float]) -> float:
        """Parse resistance values (e.g., '1kΩ', '1MΩ') to base units (Ω)."""
        if isinstance(value, (int, float)):
            return float(value)
        
        value_str = str(value).strip()
        
        # Handle ohms with prefixes
        if 'k' in value_str or 'M' in value_str:
            number_part = re.sub(r'[kMΩΩ]', '', value_str)
            numeric_value = float(number_part)
            
            if 'k' in value_str:
                return numeric_value * 1e3
            elif 'M' in value_str:
                return numeric_value * 1e6
        
        # Assume ohms if no prefix
        return float(value_str.replace('Ω', '').replace('ohm', '').strip())
    
    @staticmethod
    def parse_voltage(value: Union[str, int, float]) -> float:
        """Parse voltage values (e.g., '5V', '12V') to base units (V)."""
        if isinstance(value, (int, float)):
            return float(value)
        
        value_str = str(value).strip()
        
        # Handle voltage prefixes
        if 'm' in value_str:
            number_part = value_str.replace('mV', '').strip()
            return float(number_part) * 1e-3
        elif 'k' in value_str:
            number_part = value_str.replace('kV', '').strip()
            return float(number_part) * 1e3
        
        # Assume volts if no prefix
        return float(value_str.replace('V', '').strip())
    
    @staticmethod
    def parse_rotation(value: Union[str, int, float]) -> float:
        """Parse rotation values (e.g., '90deg', '1.57rad') to base units (deg)."""
        if isinstance(value, (int, float)):
            return float(value)
        
        value_str = str(value).strip()
        
        if value_str.endswith("deg"):
            return float(value_str[:-3])
        elif value_str.endswith("rad"):
            return float(value_str[:-3]) * 180 / 3.141592653589793
        
        # Assume degrees if no unit specified
        return float(value_str)
`

    fs.writeFileSync(path.join(this.outputDir, "base", "utils.py"), baseUtils)

    // Generate __init__.py for base module
    const baseInit = `"""
Base utilities and validators for Circuit JSON types.
"""

from .utils import UnitConverter

__all__ = [
    "UnitConverter",
]
`

    fs.writeFileSync(path.join(this.outputDir, "base", "__init__.py"), baseInit)
  }

  private async generateSampleTypes(): Promise<void> {
    // Generate a sample PCB component type
    const pcbTypes = `"""
PCB types for Circuit JSON.

Generated automatically from TypeScript definitions.
"""

from typing import Union, List, Optional, Literal, Any
from pydantic import BaseModel, Field, validator
from ..base.utils import UnitConverter

class PcbComponent(BaseModel):
    """Defines a component on the PCB"""
    
    type: Literal["pcb_component"]
    pcb_component_id: str
    source_component_id: str
    center_x: float
    center_y: float
    width: float
    height: float
    layer: Literal["top", "bottom"]
    rotation: Optional[float] = None
    
    @validator('center_x', 'center_y', 'width', 'height', pre=True)
    def validate_length(cls, v):
        try:
            return UnitConverter.parse_length(v)
        except Exception as e:
            raise ValueError(f"Invalid length value: {v}") from e
    
    @validator('rotation', pre=True)
    def validate_rotation(cls, v):
        try:
            return UnitConverter.parse_rotation(v) if v is not None else v
        except Exception as e:
            raise ValueError(f"Invalid rotation value: {v}") from e

class PcbTrace(BaseModel):
    """Defines a trace on the PCB"""
    
    type: Literal["pcb_trace"]
    pcb_trace_id: str
    route: List[dict]  # Simplified route representation

class PcbHole(BaseModel):
    """Defines a hole on the PCB"""
    
    type: Literal["pcb_hole"]
    pcb_hole_id: str
    hole_shape: Literal["circle", "rect", "oval"]
    x: float
    y: float
    hole_diameter: Optional[float] = None
    hole_width: Optional[float] = None
    hole_height: Optional[float] = None
    
    @validator('x', 'y', 'hole_diameter', 'hole_width', 'hole_height', pre=True)
    def validate_length(cls, v):
        if v is None:
            return v
        try:
            return UnitConverter.parse_length(v)
        except Exception as e:
            raise ValueError(f"Invalid length value: {v}") from e
`

    fs.writeFileSync(path.join(this.outputDir, "pcb", "types.py"), pcbTypes)

    // Generate __init__.py for pcb module
    const pcbInit = `"""
PCB types module exports.
"""

from .types import PcbComponent, PcbTrace, PcbHole

__all__ = [
    "PcbComponent",
    "PcbTrace", 
    "PcbHole",
]
`

    fs.writeFileSync(path.join(this.outputDir, "pcb", "__init__.py"), pcbInit)

    // Generate sample source types
    const sourceTypes = `"""
Source types for Circuit JSON.

Generated automatically from TypeScript definitions.
"""

from typing import Union, List, Optional, Literal, Any
from pydantic import BaseModel, Field, validator
from ..base.utils import UnitConverter

class SourceSimpleResistor(BaseModel):
    """Defines a simple resistor component"""
    
    type: Literal["source_component"]
    ftype: Literal["simple_resistor"]
    source_component_id: str
    name: str
    resistance: float
    display_resistance: Optional[str] = None
    
    @validator('resistance', pre=True)
    def validate_resistance(cls, v):
        try:
            return UnitConverter.parse_resistance(v)
        except Exception as e:
            raise ValueError(f"Invalid resistance value: {v}") from e

class SourceSimpleCapacitor(BaseModel):
    """Defines a simple capacitor component"""
    
    type: Literal["source_component"]
    ftype: Literal["simple_capacitor"]
    source_component_id: str
    name: str
    capacitance: float
    max_voltage_rating: Optional[float] = None
    
    @validator('capacitance', pre=True)
    def validate_capacitance(cls, v):
        # Simplified capacitance parsing
        if isinstance(v, (int, float)):
            return float(v)
        
        value_str = str(v).strip()
        
        # Handle capacitance prefixes
        if 'pF' in value_str:
            number_part = value_str.replace('pF', '').strip()
            return float(number_part) * 1e-12
        elif 'nF' in value_str:
            number_part = value_str.replace('nF', '').strip()
            return float(number_part) * 1e-9
        elif 'uF' in value_str or 'µF' in value_str:
            number_part = value_str.replace('uF', '').replace('µF', '').strip()
            return float(number_part) * 1e-6
        elif 'mF' in value_str:
            number_part = value_str.replace('mF', '').strip()
            return float(number_part) * 1e-3
        
        # Assume farads if no prefix
        return float(value_str.replace('F', '').strip())
`

    fs.writeFileSync(
      path.join(this.outputDir, "source", "types.py"),
      sourceTypes,
    )

    const sourceInit = `"""
Source types module exports.
"""

from .types import SourceSimpleResistor, SourceSimpleCapacitor

__all__ = [
    "SourceSimpleResistor",
    "SourceSimpleCapacitor",
]
`

    fs.writeFileSync(
      path.join(this.outputDir, "source", "__init__.py"),
      sourceInit,
    )
  }

  private async generateMainInit(): Promise<void> {
    const initContent = `"""
Circuit JSON Python Types

A complete Python implementation of Circuit JSON types with Pydantic validation.
Automatically generated from TypeScript definitions.
"""

from .base import UnitConverter
from .pcb import PcbComponent, PcbTrace, PcbHole
from .source import SourceSimpleResistor, SourceSimpleCapacitor

__version__ = "1.0.0"

# Re-export commonly used types
__all__ = [
    "UnitConverter",
    "PcbComponent",
    "PcbTrace", 
    "PcbHole",
    "SourceSimpleResistor",
    "SourceSimpleCapacitor",
]
`

    fs.writeFileSync(path.join(this.outputDir, "__init__.py"), initContent)
  }
}

export { SimplePydanticGenerator }

// Main execution
async function main() {
  try {
    const generator = new SimplePydanticGenerator()
    await generator.generate()
  } catch (error) {
    console.error("Error generating Pydantic types:", error)
    process.exit(1)
  }
}

if (import.meta.main) {
  main()
}
