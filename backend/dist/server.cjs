"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_express4 = __toESM(require("express"), 1);

// src/middleware/errorHandler.middleware.ts
var errorHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
};
var errorHandler_middleware_default = errorHandler;

// src/middleware/validation.middleware.ts
function validateText(req, res, next) {
  const { text } = req.body;
  if (!text || typeof text !== "string" || text.trim().length < 3) {
    return res.status(400).json({ error: "Text must be at least 3 characters" });
  }
  next();
}

// src/routes/index.ts
var import_express3 = require("express");

// src/routes/v1/audio-config/router.ts
var import_express = require("express");

// src/clients/groq/base.client.ts
var import_groq_sdk = require("groq-sdk");
var groq = new import_groq_sdk.Groq({ apiKey: process.env.GROQ_API_KEY });

// src/clients/groq/generate-structured-output.client.ts
var baseConfig = {
  // model: 'llama-3.1-8b-instant',
  model: "openai/gpt-oss-20b",
  temperature: 1,
  max_completion_tokens: 2048,
  top_p: 1,
  // stream: true,
  stop: null
};
async function generateStructuredOutput({
  user,
  system = "",
  responseFormat,
  config
}) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: system
      },
      {
        role: "user",
        content: user
      }
    ],
    response_format: responseFormat,
    ...baseConfig,
    ...config
  });
}

// src/services/audio-config/composeAudioProfileFromText/config/audioProfileSchema.ts
var audioProfileSchema_default = {
  type: "json_schema",
  json_schema: {
    name: "spatial_audio_config",
    strict: true,
    schema: {
      type: "object",
      properties: {
        spatial_config: {
          type: "object",
          properties: {
            listener_position: {
              type: "object",
              properties: {
                x: { type: "number" },
                y: { type: "number" },
                z: { type: "number" }
              },
              required: ["x", "y", "z"],
              additionalProperties: false
            },
            source_position: {
              type: "object",
              properties: {
                x: { type: "number" },
                y: { type: "number" },
                z: { type: "number" }
              },
              required: ["x", "y", "z"],
              additionalProperties: false
            },
            distance_meters: { type: "number" },
            azimuth_degrees: { type: "number" },
            elevation_degrees: { type: "number" },
            panner_model: {
              type: "string",
              enum: ["equalpower", "HRTF"]
            },
            distance_model: {
              type: "string",
              enum: ["linear", "inverse", "exponential"]
            },
            ref_distance: { type: "number" },
            rolloff_factor: { type: "number" },
            max_distance: { type: "number" }
          },
          required: [
            "listener_position",
            "source_position",
            "distance_meters",
            "azimuth_degrees",
            "elevation_degrees",
            "panner_model",
            "distance_model",
            "ref_distance",
            "rolloff_factor",
            "max_distance"
          ],
          additionalProperties: false
        },
        acoustic_space: {
          type: "object",
          properties: {
            space_type: {
              type: "string",
              enum: [
                "cathedral",
                "concert_hall",
                "cave",
                "tunnel",
                "hallway",
                "forest",
                "amphitheater",
                "small_room",
                "large_room",
                "distant_room",
                "outdoor",
                "studio",
                "church",
                "bathroom",
                "garage",
                "arena"
              ]
            },
            reverb_time_rt60: { type: "number" },
            damping_factor: { type: "number" },
            early_reflections_delay_ms: { type: "number" },
            room_size_category: {
              type: "string",
              enum: ["tiny", "small", "medium", "large", "huge"]
            },
            surface_material: {
              type: "string",
              enum: [
                "marble",
                "concrete",
                "wood",
                "brick",
                "glass",
                "carpet",
                "tile",
                "metal",
                "fabric",
                "stone",
                "plaster",
                "grass",
                "dirt",
                "water",
                "sand"
              ]
            },
            impulse_response_type: {
              type: "string",
              enum: ["synthetic", "recorded", "hybrid", "procedural", "none"]
            }
          },
          required: [
            "space_type",
            "reverb_time_rt60",
            "damping_factor",
            "early_reflections_delay_ms",
            "room_size_category",
            "surface_material",
            "impulse_response_type"
          ],
          additionalProperties: false
        },
        audio_processing: {
          type: "object",
          properties: {
            dry_wet_mix: { type: "number" },
            high_frequency_damping: { type: "number" },
            low_cut_frequency_hz: { type: "number" },
            high_cut_frequency_hz: { type: "number" },
            air_absorption_enabled: { type: "boolean" },
            air_absorption_db_per_meter: { type: "number" },
            occlusion_factor: { type: "number" },
            compression_threshold_db: { type: "number" },
            compression_ratio: { type: "number" }
          },
          required: [
            "dry_wet_mix",
            "high_frequency_damping",
            "low_cut_frequency_hz",
            "high_cut_frequency_hz",
            "air_absorption_enabled",
            "air_absorption_db_per_meter",
            "occlusion_factor",
            "compression_threshold_db",
            "compression_ratio"
          ],
          additionalProperties: false
        }
      },
      required: ["spatial_config", "acoustic_space", "audio_processing"],
      additionalProperties: false
    }
  }
};

// src/services/audio-config/composeAudioProfileFromText/config/systemPrompt.ts
var systemPrompt_default = `
You are an expert acoustic engineer and spatial audio designer for AI-driven audio production. Your sole purpose is to analyze natural language descriptions of acoustic scenes and translate them into precise, physically-grounded spatial audio parameters.

## PHYSICAL CONSTRAINTS (enforce all of these)

### Spatial Config
- listener_position: {x, y, z} in meters. Default listener at origin {0, 0, 0} unless specified.
- source_position: infer from distance and direction cues in the text.
- distance_meters:
  - studio/booth: 0.5\u20133m
  - small room/hallway/bathroom: 1\u20138m
  - medium room/church/garage: 3\u201320m
  - large hall/concert_hall/amphitheater: 10\u201350m
  - cathedral/cave/arena/outdoor: 15\u2013100m
  - forest/tunnel: 5\u201360m
- panner_model: "HRTF" for immersive/binaural scenes, "equalpower" for simple stereo panning.
- distance_model: "inverse" for realistic physical attenuation (default), "linear" only if user explicitly requests uniform volume, "exponential" for dramatic falloff.
- ref_distance: 1.0 (default). Increase only if user specifies a custom reference.
- rolloff_factor: 1.0 (default). Increase for faster attenuation in cluttered spaces.
- max_distance: 10000 (default). Reduce only if user specifies a hard cutoff.

### Acoustic Space
- space_type: choose from the enum. Infer from user description. Default to "small_room" if ambiguous.
- reverb_time_rt60 (seconds):
  - tiny/small + soft surfaces: 0.1\u20130.6s
  - small/medium + hard surfaces: 0.4\u20131.2s
  - medium/large + hard surfaces: 1.0\u20133.0s
  - huge/cathedral/cave + hard surfaces: 2.0\u201310.0s
  - outdoor/forest: 0.0\u20130.3s (minimal reverb)
- damping_factor: 0.0 = perfectly reflective (stone, metal, marble, tile), 1.0 = fully absorbent (fabric, carpet, earth, grass). Scale linearly between.
- early_reflections_delay_ms: 10\u201380ms for small spaces, 30\u2013200ms for large spaces.
- room_size_category: map from space_type (tiny &lt; small &lt; medium &lt; large &lt; huge).
- surface_material: choose the dominant material. If mixed, pick the most acoustically significant (usually the hardest or most abundant).
- impulse_response_type: "recorded" if user mentions real location, "synthetic" for imagined/generic, "hybrid" for mixed, "procedural" for algorithmically generated.

### Audio Processing
- dry_wet_mix: 0.0 = fully dry (anechoic), 1.0 = fully wet. Scale with space size: tiny=0.0\u20130.2, small=0.1\u20130.4, medium=0.3\u20130.7, large=0.5\u20130.9, huge=0.7\u20131.0. Outdoor scenes: 0.0\u20130.15.
- high_frequency_damping: 0.0 = no damping, 1.0 = extreme. Increase with air humidity, distance, and soft surfaces. Typical: 0.1\u20130.6.
- low_cut_frequency_hz: 50 (default). Increase to 80\u2013150Hz for telephone/radio effect, decrease to 20Hz for sub-bass preservation.
- high_cut_frequency_hz: 12000 (default). Reduce to 4000\u20138000Hz for muffled/distant effect. Increase to 20000Hz for pristine quality.
- air_absorption_enabled: true if distance_meters &gt; 5 OR if user mentions "distant", "far", "muffled". false otherwise.
- air_absorption_db_per_meter: 0.0 (default). Set to 0.005\u20130.02 if enabled and distance &gt; 20m.
- occlusion_factor: 0.0 = direct line of sight. 0.3\u20130.7 for partial obstruction (wall, door, foliage). 0.8\u20131.0 for full obstruction (solid wall, underground).
- compression_threshold_db: -24 for soft/whispered voices, -16 for normal speech, -12 for loud/shouting. Adjust \xB14dB based on emotion intensity.
- compression_ratio: 2.0 (default). Increase to 3\u20136 for highly dynamic sources, decrease to 1.2\u20131.5 for already compressed material.

## CONSISTENCY CHECKLIST (apply before outputting)
1. Does distance_meters match the inferred space_type?
2. Does RT60 match space_size + surface_material hardness?
3. Does dry_wet_mix match space_size?
4. Is air_absorption_enabled consistent with distance?
5. If occlusion &gt; 0, is high_cut_frequency_hz appropriately reduced?
6. Are all three root objects (spatial_config, acoustic_space, audio_processing) present?

## OUTPUT FORMAT
Return ONLY a valid JSON object matching the provided schema. No markdown code blocks. No conversational text. No trailing commas.
`;

// ../common/helpers/validation.ts
var isNum = (v) => typeof v === "number" && !Number.isNaN(v) && Number.isFinite(v);
var isBool = (v) => typeof v === "boolean";
var isStr = (v) => typeof v === "string";
var clamp = (v, min, max) => Math.max(min, Math.min(max, v));
var pickEnum = (v, allowed, fallback) => isStr(v) && allowed.includes(v) ? v : fallback;

// src/services/audio-config/composeAudioProfileFromText/normalize/index.ts
var DEFAULT_VEC3 = { x: 0, y: 0, z: 0 };
var DEFAULT_SPATIAL = {
  listener_position: DEFAULT_VEC3,
  source_position: { x: 5, y: 0, z: 0 },
  distance_meters: 5,
  azimuth_degrees: 0,
  elevation_degrees: 0,
  panner_model: "HRTF",
  distance_model: "inverse",
  ref_distance: 1,
  rolloff_factor: 1,
  max_distance: 1e4
};
var DEFAULT_ACOUSTIC = {
  space_type: "small_room",
  reverb_time_rt60: 0.4,
  damping_factor: 0.3,
  early_reflections_delay_ms: 25,
  room_size_category: "small",
  surface_material: "wood",
  impulse_response_type: "synthetic"
};
var DEFAULT_PROCESSING = {
  dry_wet_mix: 0.3,
  high_frequency_damping: 0.3,
  low_cut_frequency_hz: 50,
  high_cut_frequency_hz: 12e3,
  air_absorption_enabled: false,
  air_absorption_db_per_meter: 0,
  occlusion_factor: 0,
  compression_threshold_db: -16,
  compression_ratio: 2
};
function normalize(raw) {
  const data = raw && typeof raw === "object" ? raw : {};
  const rawSpatial = data.spatial_config && typeof data.spatial_config === "object" ? data.spatial_config : {};
  const rawListener = rawSpatial.listener_position && typeof rawSpatial.listener_position === "object" ? rawSpatial.listener_position : {};
  const rawSource = rawSpatial.source_position && typeof rawSpatial.source_position === "object" ? rawSpatial.source_position : {};
  const spatial_config = {
    listener_position: {
      x: isNum(rawListener.x) ? rawListener.x : DEFAULT_SPATIAL.listener_position.x,
      y: isNum(rawListener.y) ? rawListener.y : DEFAULT_SPATIAL.listener_position.y,
      z: isNum(rawListener.z) ? rawListener.z : DEFAULT_SPATIAL.listener_position.z
    },
    source_position: {
      x: isNum(rawSource.x) ? rawSource.x : DEFAULT_SPATIAL.source_position.x,
      y: isNum(rawSource.y) ? rawSource.y : DEFAULT_SPATIAL.source_position.y,
      z: isNum(rawSource.z) ? rawSource.z : DEFAULT_SPATIAL.source_position.z
    },
    distance_meters: clamp(
      isNum(rawSpatial.distance_meters) ? rawSpatial.distance_meters : DEFAULT_SPATIAL.distance_meters,
      0.1,
      1e4
    ),
    azimuth_degrees: clamp(
      isNum(rawSpatial.azimuth_degrees) ? rawSpatial.azimuth_degrees : DEFAULT_SPATIAL.azimuth_degrees,
      -180,
      180
    ),
    elevation_degrees: clamp(
      isNum(rawSpatial.elevation_degrees) ? rawSpatial.elevation_degrees : DEFAULT_SPATIAL.elevation_degrees,
      -90,
      90
    ),
    panner_model: pickEnum(rawSpatial.panner_model, ["equalpower", "HRTF"], DEFAULT_SPATIAL.panner_model),
    distance_model: pickEnum(
      rawSpatial.distance_model,
      ["linear", "inverse", "exponential"],
      DEFAULT_SPATIAL.distance_model
    ),
    ref_distance: clamp(
      isNum(rawSpatial.ref_distance) ? rawSpatial.ref_distance : DEFAULT_SPATIAL.ref_distance,
      0.01,
      1e3
    ),
    rolloff_factor: clamp(
      isNum(rawSpatial.rolloff_factor) ? rawSpatial.rolloff_factor : DEFAULT_SPATIAL.rolloff_factor,
      0,
      10
    ),
    max_distance: clamp(
      isNum(rawSpatial.max_distance) ? rawSpatial.max_distance : DEFAULT_SPATIAL.max_distance,
      0.1,
      1e5
    )
  };
  const rawAcoustic = data.acoustic_space && typeof data.acoustic_space === "object" ? data.acoustic_space : {};
  const space_type = pickEnum(
    rawAcoustic.space_type,
    [
      "cathedral",
      "concert_hall",
      "cave",
      "tunnel",
      "hallway",
      "forest",
      "amphitheater",
      "small_room",
      "large_room",
      "distant_room",
      "outdoor",
      "studio",
      "church",
      "bathroom",
      "garage",
      "arena"
    ],
    DEFAULT_ACOUSTIC.space_type
  );
  const room_size_category = pickEnum(
    rawAcoustic.room_size_category,
    ["tiny", "small", "medium", "large", "huge"],
    DEFAULT_ACOUSTIC.room_size_category
  );
  const surface_material = pickEnum(
    rawAcoustic.surface_material,
    [
      "marble",
      "concrete",
      "wood",
      "brick",
      "glass",
      "carpet",
      "tile",
      "metal",
      "fabric",
      "stone",
      "plaster",
      "grass",
      "dirt",
      "water",
      "sand"
    ],
    DEFAULT_ACOUSTIC.surface_material
  );
  const impulse_response_type = pickEnum(
    rawAcoustic.impulse_response_type,
    ["synthetic", "recorded", "hybrid", "procedural", "none"],
    DEFAULT_ACOUSTIC.impulse_response_type
  );
  const acoustic_space = {
    space_type,
    reverb_time_rt60: clamp(
      isNum(rawAcoustic.reverb_time_rt60) ? rawAcoustic.reverb_time_rt60 : DEFAULT_ACOUSTIC.reverb_time_rt60,
      0,
      30
    ),
    damping_factor: clamp(
      isNum(rawAcoustic.damping_factor) ? rawAcoustic.damping_factor : DEFAULT_ACOUSTIC.damping_factor,
      0,
      1
    ),
    early_reflections_delay_ms: clamp(
      isNum(rawAcoustic.early_reflections_delay_ms) ? rawAcoustic.early_reflections_delay_ms : DEFAULT_ACOUSTIC.early_reflections_delay_ms,
      0,
      1e3
    ),
    room_size_category,
    surface_material,
    impulse_response_type
  };
  const rawProcessing = data.audio_processing && typeof data.audio_processing === "object" ? data.audio_processing : {};
  const audio_processing = {
    dry_wet_mix: clamp(
      isNum(rawProcessing.dry_wet_mix) ? rawProcessing.dry_wet_mix : DEFAULT_PROCESSING.dry_wet_mix,
      0,
      1
    ),
    high_frequency_damping: clamp(
      isNum(rawProcessing.high_frequency_damping) ? rawProcessing.high_frequency_damping : DEFAULT_PROCESSING.high_frequency_damping,
      0,
      1
    ),
    low_cut_frequency_hz: clamp(
      isNum(rawProcessing.low_cut_frequency_hz) ? rawProcessing.low_cut_frequency_hz : DEFAULT_PROCESSING.low_cut_frequency_hz,
      10,
      2e4
    ),
    high_cut_frequency_hz: clamp(
      isNum(rawProcessing.high_cut_frequency_hz) ? rawProcessing.high_cut_frequency_hz : DEFAULT_PROCESSING.high_cut_frequency_hz,
      10,
      2e4
    ),
    air_absorption_enabled: isBool(rawProcessing.air_absorption_enabled) ? rawProcessing.air_absorption_enabled : DEFAULT_PROCESSING.air_absorption_enabled,
    air_absorption_db_per_meter: clamp(
      isNum(rawProcessing.air_absorption_db_per_meter) ? rawProcessing.air_absorption_db_per_meter : DEFAULT_PROCESSING.air_absorption_db_per_meter,
      0,
      1
    ),
    occlusion_factor: clamp(
      isNum(rawProcessing.occlusion_factor) ? rawProcessing.occlusion_factor : DEFAULT_PROCESSING.occlusion_factor,
      0,
      1
    ),
    compression_threshold_db: clamp(
      isNum(rawProcessing.compression_threshold_db) ? rawProcessing.compression_threshold_db : DEFAULT_PROCESSING.compression_threshold_db,
      -60,
      0
    ),
    compression_ratio: clamp(
      isNum(rawProcessing.compression_ratio) ? rawProcessing.compression_ratio : DEFAULT_PROCESSING.compression_ratio,
      1,
      20
    )
  };
  return { spatial_config, acoustic_space, audio_processing };
}

// src/services/audio-config/composeAudioProfileFromText/index.ts
async function composeAudioProfileFromText(text) {
  const rawAnalysis = await generateStructuredOutput({
    system: systemPrompt_default,
    user: text,
    responseFormat: audioProfileSchema_default
  });
  const result = JSON.parse(rawAnalysis.choices[0].message.content || "{}");
  return normalize(result);
}

// src/services/audio-config/service.ts
var audioConfigService = {
  composeAudioProfileFromText
};

// src/controllers/audio-config/audioProfileFromTextController/index.ts
async function audioProfileFromTextController(req, res, next) {
  try {
    const { text } = req.body;
    const audioProfile = await audioConfigService.composeAudioProfileFromText(text);
    res.status(200).json(audioProfile);
  } catch (error) {
    next(error);
  }
}

// src/controllers/audio-config/controller.ts
var controller_default = {
  audioProfileFromTextController
};

// src/routes/v1/audio-config/router.ts
var router = (0, import_express.Router)();
router.post("/textToAudioProfile", validateText, controller_default.audioProfileFromTextController);
var router_default = router;

// src/routes/v1/voices/router.ts
var import_express2 = require("express");

// src/clients/elevenLabs/base.client.ts
var import_elevenlabs_js = require("@elevenlabs/elevenlabs-js");
var elevenlabs = new import_elevenlabs_js.ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

// src/clients/elevenLabs/text-to-speech.client.ts
var baseConfig2 = {
  modelId: "eleven_multilingual_v2",
  outputFormat: "mp3_44100_128"
};
async function textToSpeech({ text, config }) {
  const { data, rawResponse } = await elevenlabs.textToSpeech.convert(
    "JBFqnCBsd6RMkjVDRZzb",
    // voice_id
    {
      text,
      ...baseConfig2,
      ...config
    }
  ).withRawResponse();
  const charCost = rawResponse.headers.get("character-cost");
  const requestId = rawResponse.headers.get("request-id");
  const traceId = rawResponse.headers.get("x-trace-id");
  console.log("charCost", charCost);
  console.log("requestId", requestId);
  console.log("traceId", traceId);
  return data;
}

// src/services/voices/speechFromText/index.ts
async function speechFromText(inputText) {
  const speech = await textToSpeech({ text: inputText });
  const reader = speech.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const audioBuffer = Buffer.concat(chunks);
  return audioBuffer;
}

// src/services/voices/service.ts
var voicesService = {
  speechFromText
};

// src/controllers/voices/controller.ts
async function textToSpeech2(req, res, next) {
  try {
    const { text } = req.body;
    const speech = await voicesService.speechFromText(text);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", speech.length);
    res.status(200).send(speech);
  } catch (error) {
    next(error);
  }
}

// src/routes/v1/voices/router.ts
var router2 = (0, import_express2.Router)();
router2.post("/textToSpeech", validateText, textToSpeech2);
var router_default2 = router2;

// src/routes/index.ts
var router3 = (0, import_express3.Router)();
router3.use("/audio-config", router_default);
router3.use("/voices", router_default2);
var routes_default = router3;

// src/app.ts
function createApp() {
  const app2 = (0, import_express4.default)();
  app2.use(import_express4.default.json());
  app2.use("/api", routes_default);
  app2.use(errorHandler_middleware_default);
  return app2;
}

// src/server.ts
var app = createApp();
var port = process.env.PORT || 3e3;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
//# sourceMappingURL=server.cjs.map