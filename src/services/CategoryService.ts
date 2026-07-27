import { CategoryRepository } from '../repositories/CategoryRepository';
import { validateInput, CreateCategorySchema, UpdateCategorySchema } from '../validators';
import { NotFoundError } from '../errors';

export class CategoryService {
  public static async createCategory(input: any) {
    const validated = validateInput(CreateCategorySchema, input);
    const slug = validated.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    return CategoryRepository.create({
      name: validated.name,
      slug,
      description: validated.description,
      parent: validated.parentId ? { connect: { id: validated.parentId } } : undefined,
    });
  }

  public static async getCategories() {
    return CategoryRepository.findAll();
  }

  public static async getCategoryById(id: string) {
    const cat = await CategoryRepository.findById(id);
    if (!cat) throw new NotFoundError('Category not found');
    return cat;
  }
}
