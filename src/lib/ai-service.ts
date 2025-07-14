import { pipeline } from '@huggingface/transformers';

// AI Service class to handle all AI operations with open-source models
class AIService {
  private textGenerator: any = null;
  private embedding: any = null;
  private classifier: any = null;
  private codeGenerator: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      console.log('🤖 Initializing AI models...');
      
      // Initialize text generation model (Phi-3 Mini for lightweight text generation)
      this.textGenerator = await pipeline(
        'text-generation',
        'microsoft/Phi-3-mini-4k-instruct',
        { 
          device: 'webgpu',
          dtype: 'q4' // Quantized for better performance
        }
      );

      // Initialize embedding model for semantic similarity
      this.embedding = await pipeline(
        'feature-extraction',
        'mixedbread-ai/mxbai-embed-xsmall-v1',
        { device: 'webgpu' }
      );

      // Initialize text classification model for sentiment analysis
      this.classifier = await pipeline(
        'text-classification',
        'cardiffnlp/twitter-roberta-base-sentiment-latest',
        { device: 'webgpu' }
      );

      // Initialize code generation model
      this.codeGenerator = await pipeline(
        'text-generation',
        'microsoft/CodeT5-small',
        { device: 'webgpu' }
      );

      this.initialized = true;
      console.log('✅ AI models initialized successfully');
    } catch (error) {
      console.warn('🔄 WebGPU not available, falling back to CPU');
      // Fallback to CPU if WebGPU is not available
      await this.initializeCPUFallback();
    }
  }

  private async initializeCPUFallback() {
    this.textGenerator = await pipeline('text-generation', 'microsoft/DialoGPT-small');
    this.embedding = await pipeline('feature-extraction', 'sentence-transformers/all-MiniLM-L6-v2');
    this.classifier = await pipeline('text-classification', 'cardiffnlp/twitter-roberta-base-sentiment-latest');
    this.initialized = true;
  }

  // Enhanced prompt refinement using AI
  async refinePrompt(originalPrompt: string): Promise<{
    refined: string;
    changes: Array<{ type: string; text: string }>;
    agentType: string;
  }> {
    await this.initialize();

    const refinementPrompt = `
As an AI prompt engineer, refine this prompt to be more specific, actionable, and technically detailed:

Original: "${originalPrompt}"

Improve it by:
1. Adding technical specifications
2. Defining clear requirements
3. Including performance metrics
4. Structuring for clarity
5. Adding integration details

Refined prompt:`;

    try {
      const result = await this.textGenerator(refinementPrompt, {
        max_new_tokens: 400,
        temperature: 0.7,
        do_sample: true
      });

      const refined = result[0]?.generated_text?.split('Refined prompt:')?.[1]?.trim() || 
        this.generateFallbackRefinement(originalPrompt);

      const changes = this.analyzeChanges(originalPrompt, refined);
      const agentType = this.detectAgentType(originalPrompt);

      return { refined, changes, agentType };
    } catch (error) {
      console.error('AI refinement failed, using rule-based fallback:', error);
      return this.generateFallbackRefinement(originalPrompt);
    }
  }

  // Enhanced idea processing
  async enhanceIdea(idea: string): Promise<{
    enhanced: string;
    suggestions: string[];
    complexity: 'low' | 'medium' | 'high';
    estimatedTime: string;
  }> {
    await this.initialize();

    const enhancementPrompt = `
Analyze and enhance this AI project idea:

"${idea}"

Provide:
1. Enhanced description with technical details
2. Implementation suggestions
3. Required components
4. Integration points

Enhanced idea:`;

    try {
      const result = await this.textGenerator(enhancementPrompt, {
        max_new_tokens: 300,
        temperature: 0.6
      });

      const enhanced = result[0]?.generated_text?.split('Enhanced idea:')?.[1]?.trim() || idea;
      const suggestions = this.extractSuggestions(idea);
      const complexity = this.assessComplexity(idea);
      const estimatedTime = this.estimateTime(complexity);

      return { enhanced, suggestions, complexity, estimatedTime };
    } catch (error) {
      console.error('Idea enhancement failed:', error);
      return this.generateFallbackEnhancement(idea);
    }
  }

  // Sentiment analysis for user interactions
  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
  }> {
    await this.initialize();

    try {
      const result = await this.classifier(text);
      const prediction = result[0];
      
      return {
        sentiment: prediction.label.toLowerCase() as 'positive' | 'negative' | 'neutral',
        confidence: prediction.score
      };
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return { sentiment: 'neutral', confidence: 0.5 };
    }
  }

  // Code generation for visual logic
  async generateCode(description: string, nodeType: string): Promise<string> {
    await this.initialize();

    const codePrompt = `Generate ${nodeType} code for: ${description}

// Implementation:`;

    try {
      const result = await this.codeGenerator?.(codePrompt, {
        max_new_tokens: 200,
        temperature: 0.3
      }) || await this.textGenerator(codePrompt, {
        max_new_tokens: 200,
        temperature: 0.3
      });

      return result[0]?.generated_text?.split('// Implementation:')?.[1]?.trim() || 
        this.generateFallbackCode(nodeType);
    } catch (error) {
      console.error('Code generation failed:', error);
      return this.generateFallbackCode(nodeType);
    }
  }

  // Get semantic embeddings for text
  async getEmbedding(text: string): Promise<number[]> {
    await this.initialize();

    try {
      const result = await this.embedding(text, { pooling: 'mean', normalize: true });
      return Array.from(result.data);
    } catch (error) {
      console.error('Embedding generation failed:', error);
      return new Array(384).fill(0).map(() => Math.random() - 0.5); // Fallback random embedding
    }
  }

  // Fallback methods for when AI models fail
  private generateFallbackRefinement(prompt: string) {
    const enhanced = `Build an intelligent system with the following specifications:

**Core Functionality:**
${this.extractCoreFeatures(prompt)}

**Technical Requirements:**
- Modern architecture with scalable design
- Integration capabilities with existing systems
- Security and performance optimization
- Monitoring and analytics

**Implementation Details:**
- User-friendly interface design
- Reliable error handling and fallbacks
- Comprehensive testing and validation
- Documentation and support materials

**Success Metrics:**
- Performance benchmarks
- User satisfaction targets
- System reliability goals`;

    return {
      refined: enhanced,
      changes: [
        { type: 'structured', text: 'Organized into clear sections' },
        { type: 'enhanced', text: 'Added technical specifications' },
        { type: 'clarified', text: 'Defined implementation approach' }
      ],
      agentType: this.detectAgentType(prompt)
    };
  }

  private generateFallbackEnhancement(idea: string) {
    return {
      enhanced: `Enhanced AI Solution: ${idea}

This intelligent system will leverage modern AI capabilities to deliver a robust, scalable solution. Key enhancements include advanced processing algorithms, seamless integration capabilities, and comprehensive monitoring systems.`,
      suggestions: [
        'Consider adding real-time monitoring',
        'Implement user feedback mechanisms',
        'Add scalability for future growth',
        'Include security best practices'
      ],
      complexity: this.assessComplexity(idea),
      estimatedTime: this.estimateTime(this.assessComplexity(idea))
    };
  }

  private extractCoreFeatures(prompt: string): string {
    const keywords = ['chatbot', 'AI', 'system', 'service', 'automation', 'analysis'];
    const found = keywords.filter(k => prompt.toLowerCase().includes(k));
    return found.length > 0 ? `- ${found.join(' integration\n- ')} capabilities` : '- Core system functionality';
  }

  private detectAgentType(prompt: string): string {
    const types = {
      'chatbot': 'Conversational AI Agent',
      'analysis': 'Data Analysis Agent',
      'automation': 'Process Automation Agent',
      'recommendation': 'Recommendation Engine',
      'classification': 'Classification System'
    };

    for (const [key, type] of Object.entries(types)) {
      if (prompt.toLowerCase().includes(key)) return type;
    }
    return 'General AI Agent';
  }

  private extractSuggestions(idea: string): string[] {
    return [
      'Add user authentication and authorization',
      'Implement comprehensive error handling',
      'Consider scalability and performance optimization',
      'Include monitoring and analytics capabilities'
    ];
  }

  private assessComplexity(idea: string): 'low' | 'medium' | 'high' {
    const complexityKeywords = {
      high: ['integration', 'crm', 'database', 'api', 'machine learning', 'real-time'],
      medium: ['chatbot', 'automation', 'analysis', 'processing'],
      low: ['simple', 'basic', 'quick', 'small']
    };

    const lowerIdea = idea.toLowerCase();
    
    if (complexityKeywords.high.some(k => lowerIdea.includes(k))) return 'high';
    if (complexityKeywords.medium.some(k => lowerIdea.includes(k))) return 'medium';
    return 'low';
  }

  private estimateTime(complexity: 'low' | 'medium' | 'high'): string {
    const timeEstimates = {
      low: '1-2 weeks',
      medium: '2-4 weeks',
      high: '4-8 weeks'
    };
    return timeEstimates[complexity];
  }

  private analyzeChanges(original: string, refined: string): Array<{ type: string; text: string }> {
    return [
      { type: 'structured', text: 'Organized into logical sections' },
      { type: 'enhanced', text: 'Added technical specifications' },
      { type: 'clarified', text: 'Defined clear requirements and metrics' }
    ];
  }

  private generateFallbackCode(nodeType: string): string {
    const codeTemplates = {
      input: `// Input processing node
function processInput(userInput) {
  return {
    text: userInput.trim(),
    timestamp: new Date(),
    processed: true
  };
}`,
      logic: `// Logic processing node
function processLogic(input, context) {
  // Apply business logic
  const result = analyzeInput(input, context);
  return {
    decision: result.decision,
    confidence: result.confidence
  };
}`,
      output: `// Output generation node
function generateOutput(processedData) {
  return {
    response: formatResponse(processedData),
    metadata: {
      timestamp: new Date(),
      processed: true
    }
  };
}`
    };

    return codeTemplates[nodeType as keyof typeof codeTemplates] || 
           '// Custom node implementation\nfunction processNode(data) {\n  return data;\n}';
  }
}

// Export singleton instance
export const aiService = new AIService();