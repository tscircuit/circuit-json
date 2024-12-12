from dataclasses import dataclass
from decimal import Decimal
from enum import Enum
from typing import Dict, Optional, Union, Literal, TypeVar, Any
from pydantic import BaseModel, validator

class BaseTscircuitUnit(str, Enum):
    MS = "ms"
    MM = "mm"
    G = "g"
    DEG = "deg"
    HZ = "Hz"
    ML = "ml"
    V = "V"
    A = "A"
    OHM = "Ω"
    F = "F"
    H = "H"

@dataclass
class UnitInfo:
    base_unit: BaseTscircuitUnit
    conversion_factor: float

class SIUnitConverter:
    SI_PREFIX_MULTIPLIER: Dict[str, Decimal] = {
        'tera': Decimal('1e12'),
        'T': Decimal('1e12'),
        'giga': Decimal('1e9'),
        'G': Decimal('1e9'),
        'mega': Decimal('1e6'),
        'M': Decimal('1e6'),
        'kilo': Decimal('1e3'),
        'k': Decimal('1e3'),
        'deci': Decimal('1e-1'),
        'd': Decimal('1e-1'),
        'centi': Decimal('1e-2'),
        'c': Decimal('1e-2'),
        'milli': Decimal('1e-3'),
        'm': Decimal('1e-3'),
        'micro': Decimal('1e-6'),
        'u': Decimal('1e-6'),
        'µ': Decimal('1e-6'),
        'nano': Decimal('1e-9'),
        'n': Decimal('1e-9'),
        'pico': Decimal('1e-12'),
        'p': Decimal('1e-12'),
    }

    UNIT_MAPPINGS: Dict[str, Dict[str, Any]] = {
        'Hz': {
            'base_unit': BaseTscircuitUnit.HZ,
            'variants': {
                'MHz': 1e6,
                'kHz': 1e3,
                'Hz': 1,
            },
        },
        'g': {
            'base_unit': BaseTscircuitUnit.G,
            'variants': {
                'kg': 1e3,
                'g': 1,
            },
        },
        'Ω': {
            'base_unit': BaseTscircuitUnit.OHM,
            'variants': {
                'mΩ': 1e-3,
                'Ω': 1,
                'kΩ': 1e3,
                'MΩ': 1e6,
                'GΩ': 1e9,
                'TΩ': 1e12,
            },
        },
        'V': {
            'base_unit': BaseTscircuitUnit.V,
            'variants': {
                'mV': 1e-3,
                'V': 1,
                'kV': 1e3,
                'MV': 1e6,
                'GV': 1e9,
                'TV': 1e12,
            },
        },
        'A': {
            'base_unit': BaseTscircuitUnit.A,
            'variants': {
                'µA': 1e-6,
                'mA': 1e-3,
                'ma': 1e-3,
                'A': 1,
                'kA': 1e3,
                'MA': 1e6,
            },
        },
        'F': {
            'base_unit': BaseTscircuitUnit.F,
            'variants': {
                'pF': 1e-12,
                'nF': 1e-9,
                'µF': 1e-6,
                'uF': 1e-6,
                'mF': 1e-3,
                'F': 1,
            },
        },
        'ml': {
            'base_unit': BaseTscircuitUnit.ML,
            'variants': {
                'ml': 1,
                'mL': 1,
                'l': 1e3,
                'L': 1e3,
            },
        },
        'deg': {
            'base_unit': BaseTscircuitUnit.DEG,
            'variants': {
                'rad': 180 / 3.141592653589793,
            },
        },
        'ms': {
            'base_unit': BaseTscircuitUnit.MS,
            'variants': {
                's': 1000,
            },
        },
        'mm': {
            'base_unit': BaseTscircuitUnit.MM,
            'variants': {
                'nm': 1e-6,
                'µm': 1e-3,
                'um': 1e-3,
                'mm': 1,
                'cm': 10,
                'dm': 100,
                'm': 1000,
                'km': 1e6,
                'in': 25.4,
                'ft': 304.8,
                'IN': 25.4,
                'FT': 304.8,
                'yd': 914.4,
                'mi': 1.609344e6,
                'mil': 0.0254,
            },
        },
    }

    @classmethod
    def get_base_unit(cls, unit: str) -> UnitInfo:
        for base_unit, info in cls.UNIT_MAPPINGS.items():
            if unit in info['variants']:
                return UnitInfo(
                    base_unit=info['base_unit'],
                    conversion_factor=info['variants'][unit]
                )
        return UnitInfo(
            base_unit=BaseTscircuitUnit(unit),
            conversion_factor=1
        )

    @classmethod
    def parse_and_convert(
        cls,
        value: Union[str, float, None, Dict[str, Union[str, float]]]
    ) -> Dict[str, Any]:
        if value is None:
            return {"parsed_unit": None, "unit_of_value": None, "value": None}

        if isinstance(value, (int, float)):
            return {"parsed_unit": None, "unit_of_value": None, "value": float(value)}

        if isinstance(value, dict) and "x" in value and "y" in value:
            x_conv = cls.parse_and_convert(value["x"])
            y_conv = cls.parse_and_convert(value["y"])
            return {
                "parsed_unit": x_conv["parsed_unit"],
                "unit_of_value": x_conv["unit_of_value"],
                "value": {"x": x_conv["value"], "y": y_conv["value"]}
            }

        if isinstance(value, str):
            if value.replace(".", "").isdigit():
                return {
                    "parsed_unit": None,
                    "unit_of_value": None,
                    "value": float(value)
                }

            for i, char in enumerate(reversed(value)):
                if char.isdigit() or char == ".":
                    continue
                unit = value[-i:] if i > 0 else ""
                number_part = value[:-i] if i > 0 else value
                break
            else:
                raise ValueError(f"Could not determine unit: {value}")

            if (unit in cls.SI_PREFIX_MULTIPLIER and
                unit not in {v for info in cls.UNIT_MAPPINGS.values()
                           for v in info['variants']}):
                multiplier = cls.SI_PREFIX_MULTIPLIER[unit]
                return {
                    "parsed_unit": None,
                    "unit_of_value": None,
                    "value": float(number_part) * float(multiplier)
                }

            unit_info = cls.get_base_unit(unit)
            return {
                "parsed_unit": unit,
                "unit_of_value": unit_info.base_unit,
                "value": unit_info.conversion_factor * float(number_part)
            }

        raise ValueError(f"Unsupported value type: {type(value)}")

class CircuitBaseModel(BaseModel):
    class Config:
        extra = "forbid"
        arbitrary_types_allowed = True

    @validator("*")
    def validate_unit_fields(cls, v, field):
        if field.field_info.extra.get("is_unit_field"):
            return SIUnitConverter.parse_and_convert(v)["value"]
        return v
