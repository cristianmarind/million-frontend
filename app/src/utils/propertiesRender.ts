import _ from 'lodash';
import Property from '../core/domain/Property';

export const getEnabledCategories = (properties: Property[]) => {
    const enabledCategories = _.uniq(_.map(properties, 'category'));
    enabledCategories.push(0)

    return _.sortBy(enabledCategories);
}

